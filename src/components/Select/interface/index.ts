import type { Ref } from 'vue';

export interface SelectConfig {
    // 基础配置
    pageSize?: number;
    debounceTime?: number;
    initialPage?: number;

    // 高级特性
    cache?: boolean;
    transform?: (data: any) => any;
}

export interface FetchParams {
    query: string;
    page: number;
    pageSize: number;
}

export interface UseSelectReturn<T = any> {
    displayOptions: Ref<T[]>;
    loading: Ref<boolean>;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    total: Ref<number>;
    handleSearch: (query: string) => void;
    handleSizeChange: (size: number) => void;
    handleCurrentChange: (page: number) => void;
    refresh: () => Promise<void>;
}

// 缓存相关类型
export interface CacheOptions {
    enable: boolean;
    maxAge?: number;
    maxSize?: number;
}

export interface CacheItem<T = any> {
    data: T;
    timestamp: number;
}
