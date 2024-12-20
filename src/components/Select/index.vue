<template>
    <el-select v-model="modelValue" :style="customStyles" :loading="loading" v-bind="$attrs" filterable remote :remote-method="handleSearch" @change="handleChange">
        <el-option v-for="option in options" :key="option[fieldNames.value]" :label="option[fieldNames.label]" :value="option[fieldNames.value]" />
        <template #footer v-if="showPagination">
            <el-pagination :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </template>
    </el-select>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { SelectProps, SelectEmits } from './types';

const props = defineProps<SelectProps>();
const emit = defineEmits<SelectEmits>();

const modelValue = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
});

const handleChange = (value: string) => {
    emit('change', value);
};

const handleSearch = (query: string) => {
    emit('search', query);
};

const handleSizeChange = (size: number) => {
    emit('sizeChange', size);
};

const handleCurrentChange = (current: number) => {
    emit('currentChange', current);
};
</script>

<style scoped lang="scss">
.pagination {
    float: right;
}
</style>
