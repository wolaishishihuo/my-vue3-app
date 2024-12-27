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
