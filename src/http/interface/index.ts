import type { InternalAxiosRequestConfig } from 'axios';

// 请求响应参数（不包含data）
export interface Result {
    status: string;
    message: string;
    success: boolean;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
    data: T;
}
// 分页请求响应参数
export interface PageResult<T = any> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
}

// 重试配置
export interface RetryConfig {
    isRetry: boolean; // 是否开启重试
    count?: number; // 重试次数，默认3次
    waitTime?: number; // 重试等待时间，默认1000ms
}

// 自定义请求配置
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    retryConfig?: RetryConfig;
    currentCount?: number; // 当前重试次数
    cancel?: boolean; // 是否取消重复请求
    loading?: boolean; // 是否显示loading
}
