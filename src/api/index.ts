import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import useEnv from '@/hooks/useEnv';
import { ResultEnum } from '@/enums/httpEnum';
import { CustomAxiosRequestConfig, ResultData } from './interface';

const { VITE_BASE_API } = useEnv();
const serviceConfig = {
    baseURL: VITE_BASE_API,
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
};

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
                const { data } = response;
                // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
                return data;
            },
            async (error: AxiosError) => {
                return Promise.reject(error);
            }
        );
    }

    /**
     * @description 常用请求方法封装
     */
    get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
        return this.service.get(url, { params, ..._object });
    }
    post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
        return this.service.post(url, params, _object);
    }
    put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
        return this.service.put(url, params, _object);
    }
    delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
        return this.service.delete(url, { params, ..._object });
    }
    download(url: string, params?: object, _object = {}): Promise<BlobPart> {
        return this.service.post(url, params, { ..._object, responseType: 'blob' });
    }
}
export default new HttpRequest(serviceConfig);
