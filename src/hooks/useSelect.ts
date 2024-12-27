import { Ref, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import type { UseSelectReturn, SelectConfig, FetchParams } from '@/components/Select/interface';
import { PageResult } from '@/http/interface';
import { useLocalCache } from './useLocalCache';

const defaultConfig: Required<SelectConfig> = {
    pageSize: 10,
    debounceTime: 300,
    initialPage: 1,
    cache: true,
    transform: data => data
};

export function useSelect<T extends Record<string, any>>({
    fetchData,
    config = {}
}: {
    fetchData: (params?: Partial<FetchParams>) => Promise<PageResult<T>>;
    config?: SelectConfig;
}): UseSelectReturn<T> {
    const finalConfig = { ...defaultConfig, ...config };
    const { getCache, setCache } = useLocalCache<{ data: T[]; total: number }>({
        localKey: 'select-cache',
        expiryTime: 1000 * 60 * 5 // 5分钟
    });
    // 状态管理
    const loading = ref(false);
    const currentPage = ref(finalConfig.initialPage);
    const pageSize = ref(finalConfig.pageSize);
    const total = ref(0);
    const displayOptions = ref<T[]>([]);
    const currentQuery = ref('');
    // 带防抖的搜索处理
    const handleSearch = useDebounceFn(async (query: string) => {
        currentQuery.value = query;
        const cacheKey = `${query}_${currentPage.value}_${pageSize.value}`;
        if (finalConfig.cache) {
            const cachedData = getCache(cacheKey);
            if (cachedData) {
                displayOptions.value = cachedData.data;
                total.value = cachedData.total;
                return;
            }
        }

        loading.value = true;
        try {
            const params: FetchParams = {
                query,
                page: currentPage.value,
                pageSize: pageSize.value
            };

            const { data, total: totalCount } = await fetchData(params);

            const transformedData = finalConfig.transform(data);
            displayOptions.value = transformedData;
            total.value = totalCount;

            if (finalConfig.cache) {
                setCache(cacheKey, { data: transformedData, total: totalCount });
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            displayOptions.value = [];
            total.value = 0;
        } finally {
            loading.value = false;
        }
    }, finalConfig.debounceTime);

    // 分页处理
    const handleSizeChange = async (size: number) => {
        pageSize.value = size;
        currentPage.value = 1;
        await handleSearch(currentQuery.value);
    };

    const handleCurrentChange = async (page: number) => {
        currentPage.value = page;
        await handleSearch(currentQuery.value);
    };

    // 刷新数据
    const refresh = async () => {
        currentPage.value = 1;
        await handleSearch('');
    };
    return {
        displayOptions: displayOptions as Ref<T[]>,
        loading,
        currentPage,
        pageSize,
        total,
        handleSearch,
        handleSizeChange,
        handleCurrentChange,
        refresh
    };
}
