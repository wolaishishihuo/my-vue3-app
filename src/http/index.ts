import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import useEnv from '@/hooks/useEnv';
import { ResultEnum } from '@/enums/httpEnum';
import { CustomAxiosRequestConfig, ResultData } from './interface';
import { AxiosCanceler } from './helper/axiosCancel';
import { ElMessage } from 'element-plus';
import { checkStatus } from './helper/checkStatus';
import { retry } from './helper/axiosRetry';
import { useUserStore } from '@/stores/modules/user';

const { VITE_BASE_URL } = useEnv();
const serviceConfig = {
    baseURL: VITE_BASE_URL,
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
};

const axiosCanceler = new AxiosCanceler();

class HttpRequest {
    service: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config);

        /**
         * @description 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
         */
        this.service.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                const userStore = useUserStore();
                // 是否清除重复请求
                const cancel = (config.cancel ??= false);
                if (cancel) {
                    axiosCanceler.addPending(config);
                }
                if (config.headers && typeof config.headers.set === 'function') {
                    config.headers.set('x-access-token', userStore.token);
                    config.headers.set('Authorization', 'Bearer ' + userStore.token);
                }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        /**
         * @description 响应拦截器
         *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
                const { data, config } = response;
                axiosCanceler.removePending(config);
                // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
                if (data.code && data.code !== ResultEnum.SUCCESS) {
                    ElMessage.error(data.msg);
                    return Promise.reject(data);
                }
                // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            async (error: AxiosError) => {
                const { response } = error;
                if (error.message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试');
                if (error.message.indexOf('Network Error') !== -1) ElMessage.error('网络错误！请您稍后重试');
                if (axios.isCancel(error)) {
                    return Promise.reject(error);
                }
                // 根据服务器响应的错误状态码，做不同的处理
                if (response) checkStatus(response.status, response);
                return retry(this.service, error);
            }
        );
    }

    /**
     * @description 常用请求方法封装
     */
    get<T>(url: string, params?: object, _object: Partial<CustomAxiosRequestConfig> = {}): Promise<ResultData<T>> {
        return this.service.get(url, { params, ..._object });
    }
    post<T>(url: string, params?: object | string, _object: Partial<CustomAxiosRequestConfig> = {}): Promise<ResultData<T>> {
        return this.service.post(url, params, _object);
    }
    put<T>(url: string, params?: object, _object: Partial<CustomAxiosRequestConfig> = {}): Promise<ResultData<T>> {
        return this.service.put(url, params, _object);
    }
    delete<T>(url: string, params?: any, _object: Partial<CustomAxiosRequestConfig> = {}): Promise<ResultData<T>> {
        return this.service.delete(url, { params, ..._object });
    }
    download(url: string, params?: object, _object: Partial<CustomAxiosRequestConfig> = {}): Promise<BlobPart> {
        return this.service.post(url, params, { ..._object, responseType: 'blob' });
    }
}
export default new HttpRequest(serviceConfig);
