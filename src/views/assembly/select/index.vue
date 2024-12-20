<template>
    <div class="assembly-select">
        <h3>本地搜索示例</h3>
        <Select
            v-model="localValue"
            :field-names="fieldNames"
            :options="localDisplayOptions"
            :loading="localLoading"
            :show-pagination="true"
            :current-page="localCurrentPage"
            :page-size="localPageSize"
            :total="localTotal"
            @search="localHandleSearch"
            @size-change="localHandleSizeChange"
            @current-change="localHandleCurrentChange"
            @change="handleLocalChange"
        />

        <h3 class="mt-4">远程搜索示例</h3>
        <Select
            v-model="remoteValue"
            :field-names="fieldNames"
            :options="remoteDisplayOptions"
            :loading="remoteLoading"
            :show-pagination="true"
            :current-page="remoteCurrentPage"
            :page-size="remotePageSize"
            :total="remoteTotal"
            @search="remoteHandleSearch"
            @size-change="remoteHandleSizeChange"
            @current-change="remoteHandleCurrentChange"
            @change="handleRemoteChange"
        />
    </div>
</template>

<script setup lang="ts" name="assemblySelect">
import { onMounted, ref } from 'vue';
import Select from '@/components/Select/index.vue';
import { useSelect } from '@/components/Select/useSelect';
import type { FieldNames, Options, FetchParams } from '@/components/Select/types';

// 字段名配置
const fieldNames: FieldNames = {
    label: 'name',
    value: 'id'
};

// 模拟本地数据
const localData = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri'
].map(item => ({
    id: `value:${item}`,
    name: `label:${item}`
}));

// 模拟远程API调用
const mockFetchData = async (params: FetchParams): Promise<{ data: Options; total: number }> => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    const filteredData = localData.filter(item => item.name.toLowerCase().includes(params.query.toLowerCase()));

    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
        data: filteredData.slice(start, end),
        total: filteredData.length
    };
};

// 本地搜索示例
const localValue = ref('');
const {
    displayOptions: localDisplayOptions,
    loading: localLoading,
    currentPage: localCurrentPage,
    pageSize: localPageSize,
    total: localTotal,
    handleSearch: localHandleSearch,
    handleSizeChange: localHandleSizeChange,
    handleCurrentChange: localHandleCurrentChange
} = useSelect({
    fieldNames,
    initialOptions: localData,
    config: {
        localSearch: true,
        remoteSearch: false,
        pagination: true,
        pageSize: 5
    }
});

// 远程搜索示例
const remoteValue = ref('');
const {
    displayOptions: remoteDisplayOptions,
    loading: remoteLoading,
    currentPage: remoteCurrentPage,
    pageSize: remotePageSize,
    total: remoteTotal,
    handleSearch: remoteHandleSearch,
    handleSizeChange: remoteHandleSizeChange,
    handleCurrentChange: remoteHandleCurrentChange
} = useSelect({
    fieldNames,
    config: {
        localSearch: false,
        remoteSearch: true,
        pagination: true,
        pageSize: 5,
        debounceTime: 500
    },
    fetchData: mockFetchData
});

// 选择事件处理
const handleLocalChange = (val: string) => {
    console.log('Local selected:', val);
};

const handleRemoteChange = (val: string) => {
    console.log('Remote selected:', val);
};
</script>

<style scoped lang="scss">
.assembly-select {
    padding: 20px;

    h3 {
        margin-bottom: 16px;
        color: var(--el-text-color-primary);
        font-weight: 500;
    }

    .mt-4 {
        margin-top: 24px;
    }
}
</style>
