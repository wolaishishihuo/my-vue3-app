<template>
    <el-select v-model="modelValue" :loading="loading" v-bind="$attrs" :remote-method="handleSearch" @change="handleChange">
        <el-option v-for="option in displayOptions" :key="option[fieldNames.value]" :label="option[fieldNames.label]" :value="option[fieldNames.value]" />
        <template #footer v-if="showPagination">
            <el-pagination :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </template>
    </el-select>
</template>

<script lang="ts" setup>
import { computed, onMounted, useAttrs } from 'vue';
import { SelectConfig } from './interface';
import { useSelect } from '@/hooks/useSelect';

interface Props {
    modelValue: string | string[];
    fetchData: (params: any) => Promise<any>;
    config?: SelectConfig;
    showPagination?: boolean;
    fieldNames?: {
        label: string;
        value: string;
    };
}
const props = withDefaults(defineProps<Props>(), {
    fieldNames: () => ({ label: 'label', value: 'value' }),
    showPagination: () => false,
    config: () => ({
        pageSize: 10,
        debounceTime: 300
    })
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | string[]): void;
    (e: 'change', value: string): void;
}>();

const modelValue = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
});

const handleChange = (value: string) => {
    emit('change', value);
};

const { displayOptions, loading, currentPage, pageSize, total, handleSearch, handleSizeChange, handleCurrentChange, refresh } = useSelect({
    fetchData: props.fetchData,
    config: {
        ...props.config
    }
});
// 组件挂载时加载初始数据
const attrs = useAttrs();
onMounted(() => {
    if (!attrs.remote) {
        refresh();
    }
});
// 暴露方法给父组件
defineExpose({
    refresh
});
</script>

<style scoped lang="scss">
.pagination {
    float: right;
}
</style>
