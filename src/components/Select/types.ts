import type { ComputedRef, Ref } from 'vue';

export interface FieldNames {
    label: string;
    value: string;
}

export type SelectOption = Record<string, any>;

export type Options = SelectOption[];

export interface SelectProps {
    modelValue: string;
    fieldNames: FieldNames;
    options: Options;
    loading?: boolean;
    customStyles?: Record<string, string>;
    showPagination?: boolean;
    currentPage?: number;
    pageSize?: number;
    total?: number;
}

export interface SelectEmits {
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
    (e: 'search', value: string): void;
    (e: 'sizeChange', value: number): void;
    (e: 'currentChange', value: number): void;
}

export interface FetchParams {
    query: string;
    page: number;
    pageSize: number;
}

export interface FetchResult<T = SelectOption> {
    data: T[];
    total: number;
}

export interface UseSelectConfig {
    // 是否开启本地搜索
    localSearch?: boolean;
    // 是否开启远程搜索
    remoteSearch?: boolean;
    // 是否开启分页
    pagination?: boolean;
    // 初始页码
    initialPage?: number;
    // 每页条数
    pageSize?: number;
    // 搜索防抖时间(ms)
    debounceTime?: number;
    // 自定义过滤函数
    filterFn?: <T>(options: T[], query: string, fieldNames: FieldNames) => T[];
}

export interface UseSelectProps<T = SelectOption> {
    // Select组件配置
    config?: UseSelectConfig;
    // 远程数据获取函数
    fetchData?: (params: FetchParams) => Promise<FetchResult<T>>;
}

export interface UseSelectReturn<T> {
    // 数据相关
    displayOptions: Ref<T[]>;
    loading: Ref<boolean>;
    // 分页相关
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    total: Ref<number>;
    // 方法
    handleSearch: (query: string) => void;
    handleSizeChange: (size: number) => void;
    handleCurrentChange: (current: number) => void;
    refresh: () => Promise<void>;
    // 状态
    searchQuery: Ref<string>;
}

// 内部使用的状态类型
export interface SelectState<T> {
    loading: Ref<boolean>;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    total: Ref<number>;
    searchQuery: Ref<string>;
    allOptions: Ref<T[]>;
    displayOptions: Ref<T[]>;
}
