import { Ref, ref, toRefs, watch } from 'vue';
import type { UseSelectProps, UseSelectReturn, FetchParams, UseSelectConfig, SelectState } from './types';

// 默认配置
const defaultConfig: Required<UseSelectConfig> = {
    localSearch: true,
    remoteSearch: false,
    pagination: true,
    initialPage: 1,
    pageSize: 10,
    debounceTime: 300,
    filterFn: <T>(options: T[], query: string, fieldNames: { label: string; value: string }) => {
        return options.filter(item =>
            String(item[fieldNames.label as keyof T])
                .toLowerCase()
                .includes(query.toLowerCase())
        );
    }
};

export function useSelect<T extends Record<string, any>>({ fieldNames, config = {}, fetchData, initialOptions = [] }: UseSelectProps<T>): UseSelectReturn<T> {
    // 合并配置
    const finalConfig: Required<UseSelectConfig> = { ...defaultConfig, ...config };

    // 状态管理
    const state = {
        loading: ref(false),
        currentPage: ref(finalConfig.initialPage),
        pageSize: ref(finalConfig.pageSize),
        total: ref(0),
        searchQuery: ref(''),
        allOptions: ref<T[]>(initialOptions) as Ref<T[]>,
        displayOptions: ref<T[]>([]) as Ref<T[]>
    } satisfies SelectState<T>;

    // 本地搜索和过滤
    const filterLocalOptions = () => {
        if (!finalConfig.localSearch) {
            state.displayOptions.value = [...state.allOptions.value];
            return;
        }

        const filteredOptions = finalConfig.filterFn([...state.allOptions.value], state.searchQuery.value, fieldNames);

        if (finalConfig.pagination) {
            state.total.value = filteredOptions.length;
            const start = (state.currentPage.value - 1) * state.pageSize.value;
            const end = start + state.pageSize.value;
            state.displayOptions.value = filteredOptions.slice(start, end);
        } else {
            state.displayOptions.value = filteredOptions;
            state.total.value = filteredOptions.length;
        }
    };

    // 远程数据获取
    const fetchRemoteData = async () => {
        if (!fetchData) return;

        state.loading.value = true;
        try {
            const params: FetchParams = {
                query: state.searchQuery.value,
                page: state.currentPage.value,
                pageSize: state.pageSize.value
            };

            const { data, total: totalCount } = await fetchData(params);

            if (finalConfig.remoteSearch) {
                state.displayOptions.value = [...data];
                state.total.value = totalCount;
            } else {
                state.allOptions.value = [...data];
                state.total.value = totalCount;
                filterLocalOptions();
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            state.displayOptions.value = [];
            state.total.value = 0;
        } finally {
            state.loading.value = false;
        }
    };

    // 搜索处理
    const handleSearch = (query: string) => {
        state.searchQuery.value = query;
        state.currentPage.value = 1;
        if (finalConfig.remoteSearch) {
            fetchRemoteData();
        } else {
            filterLocalOptions();
        }
    };

    // 分页处理
    const handleSizeChange = async (size: number) => {
        state.pageSize.value = size;
        state.currentPage.value = 1;
        if (finalConfig.remoteSearch) {
            await fetchRemoteData();
        } else {
            filterLocalOptions();
        }
    };

    const handleCurrentChange = async (page: number) => {
        state.currentPage.value = page;
        if (finalConfig.remoteSearch) {
            await fetchRemoteData();
        } else {
            filterLocalOptions();
        }
    };

    // 刷新数据
    const refresh = async () => {
        if (finalConfig.remoteSearch) {
            await fetchRemoteData();
        } else {
            filterLocalOptions();
        }
    };

    // 监听初始数据变化
    watch(
        () => initialOptions,
        newOptions => {
            state.allOptions.value = [...newOptions];
            refresh();
        },
        { deep: true }
    );

    // 初始化
    if (finalConfig.remoteSearch) {
        fetchRemoteData();
    } else {
        filterLocalOptions();
    }

    return {
        ...toRefs(state),
        handleSearch,
        handleSizeChange,
        handleCurrentChange,
        refresh
    };
}
