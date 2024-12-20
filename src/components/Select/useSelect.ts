import { ref } from 'vue';
import type { UseSelectProps, FetchParams } from './types';

// 简化的默认配置
const defaultConfig = {
    initialPage: 1,
    pageSize: 10,
    debounceTime: 300
};

export function useSelect<T extends Record<string, any>>({ config = {}, fetchData }: UseSelectProps<T>) {
    // 状态管理
    const loading = ref(false);
    const currentPage = ref(config.initialPage ?? defaultConfig.initialPage);
    const pageSize = ref(config.pageSize ?? defaultConfig.pageSize);
    const total = ref(0);
    const searchQuery = ref('');
    const displayOptions = ref<T[]>([]);

    // 远程数据获取
    const fetchRemoteData = async () => {
        if (!fetchData) return;

        loading.value = true;
        try {
            const params: FetchParams = {
                query: searchQuery.value,
                page: currentPage.value,
                pageSize: pageSize.value
            };

            const { data, total: totalCount } = await fetchData(params);
            displayOptions.value = data;
            total.value = totalCount;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            displayOptions.value = [];
            total.value = 0;
        } finally {
            loading.value = false;
        }
    };

    // 搜索处理
    const handleSearch = (query: string) => {
        searchQuery.value = query;
        currentPage.value = 1;
        fetchRemoteData();
    };

    // 分页处理
    const handleSizeChange = async (size: number) => {
        pageSize.value = size;
        currentPage.value = 1;
        await fetchRemoteData();
    };

    const handleCurrentChange = async (page: number) => {
        currentPage.value = page;
        await fetchRemoteData();
    };

    // 刷新数据
    const refresh = () => {
        currentPage.value = 1;
        fetchRemoteData();
    };

    return {
        displayOptions,
        loading,
        currentPage,
        pageSize,
        total,
        searchQuery,
        handleSearch,
        handleSizeChange,
        handleCurrentChange,
        refresh
    };
}
