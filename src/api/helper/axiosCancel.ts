import { CustomAxiosRequestConfig } from '../interface';
import qs from 'qs';

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, AbortController>();

// 序列化参数
export const getPendingUrl = (config: CustomAxiosRequestConfig) => [config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join('&');

export class AxiosCanceler {
    /**
     * @description: 添加请求
     * @param {Object} config
     * @return void
     */
    addPending(config: CustomAxiosRequestConfig) {
        // 在请求开始前，对之前的请求做检查取消操作
        this.removePending(config);
        const url = getPendingUrl(config);
        const abortController = new AbortController();
        config.signal = abortController.signal;
        if (!pendingMap.has(url)) {
            pendingMap.set(url, abortController);
        }
    }

    /**
     * @description: 移除请求
     * @param {Object} config
     */
    removePending(config: CustomAxiosRequestConfig) {
        const url = getPendingUrl(config);
        // 如果在 pending 中存在当前请求标识，需要取消当前请求
        if (pendingMap.has(url)) {
            const abortController = pendingMap.get(url);
            abortController?.abort();
            pendingMap.delete(url);
        }
    }

    /**
     * @description: 清空所有pending
     */
    removeAllPending() {
        pendingMap.forEach(controller => {
            controller && controller.abort();
        });
        pendingMap.clear();
    }
}
