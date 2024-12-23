// src/views/assembly/select/index.vue
<template>
    <div class="select-test-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <h2>Select 组件测试</h2>
                </div>
            </template>

            <el-form :model="form" label-width="120px">
                <!-- 基础使用 -->
                <el-form-item label="基础选择">
                    <BaseSelect v-model="form.basicId" :fetch-data="fetchBasicData" placeholder="请选择" clearable />
                    <div class="form-item-help">
                        <el-tag size="small" type="info">基础使用</el-tag>
                    </div>
                </el-form-item>

                <!-- 多选示例 -->
                <el-form-item label="多选示例">
                    <BaseSelect
                        v-model="form.multipleIds"
                        :fetch-data="fetchRemoteData"
                        show-pagination
                        :config="{
                            pageSize: 10,
                            debounceTime: 300,
                            cache: true
                        }"
                        multiple
                        collapse-tags
                        placeholder="请选择多个选项"
                        clearable
                    />
                    <div class="form-item-help">
                        <el-tag size="small" type="info">多选 + 分页处理</el-tag>
                    </div>
                </el-form-item>

                <!-- 本地搜索 -->
                <el-form-item label="本地搜索">
                    <BaseSelect v-model="form.searchId" :fetch-data="fetchBasicData" filterable placeholder="支持本地搜索" clearable />
                    <div class="form-item-help">
                        <el-tag size="small" type="info">本地搜索</el-tag>
                    </div>
                </el-form-item>

                <!-- 远程搜索 -->
                <el-form-item label="远程搜索">
                    <BaseSelect
                        v-model="form.remoteId"
                        :fetch-data="fetchRemoteData"
                        show-pagination
                        :config="{
                            pageSize: 10,
                            debounceTime: 300,
                            cache: true
                        }"
                        filterable
                        remote
                        remote-show-suffix
                        placeholder="远程搜索"
                        clearable
                    />
                    <div class="form-item-help">
                        <el-tag size="small" type="info">远程搜索 + 分页 + 缓存</el-tag>
                    </div>
                </el-form-item>

                <!-- 自定义字段 -->
                <el-form-item label="自定义字段">
                    <BaseSelect v-model="form.customId" :fetch-data="fetchCustomData" :field-names="{ label: 'name', value: 'id' }" filterable clearable placeholder="自定义字段映射" />
                    <div class="form-item-help">
                        <el-tag size="small" type="info">自定义字段映射</el-tag>
                    </div>
                </el-form-item>
            </el-form>

            <!-- 选中数据展示 -->
            <el-divider>选中数据</el-divider>
            <el-descriptions :column="1" border>
                <el-descriptions-item label="基础选择">{{ form.basicId }}</el-descriptions-item>
                <el-descriptions-item label="多选示例">{{ form.multipleIds }}</el-descriptions-item>
                <el-descriptions-item label="本地搜索">{{ form.searchId }}</el-descriptions-item>
                <el-descriptions-item label="远程搜索">{{ form.remoteId }}</el-descriptions-item>
                <el-descriptions-item label="自定义字段">{{ form.customId }}</el-descriptions-item>
            </el-descriptions>

            <!-- 测试按钮 -->
            <div class="test-actions">
                <el-button type="primary" @click="handleRefresh">刷新数据</el-button>
                <el-button @click="handleReset">重置数据</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="selectTest">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import BaseSelect from '@/components/Select/index.vue';

// 表单数据
const form = reactive({
    basicId: '',
    multipleIds: [] as string[],
    searchId: '',
    remoteId: '',
    customId: ''
});

// 基础数据
const basicData = Array.from({ length: 20 }, (_, index) => ({
    label: `选项 ${index + 1}`,
    value: `${index + 1}`
}));

// 基础数据获取
const fetchBasicData = async () => {
    return {
        data: basicData,
        total: basicData.length
    };
};

// 远程数据获取
const fetchRemoteData = async (params: { query: string; page: number; pageSize: number }) => {
    const { query = '', page = 1, pageSize = 10 } = params;

    // 模拟远程数据
    const allData = Array.from({ length: 100 }, (_, index) => ({
        label: `远程选项 ${index + 1}`,
        value: `${index + 1}`
    }));

    // 根据查询条件过滤
    let filteredData = allData;
    if (query) {
        filteredData = allData.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
    }

    // 分页处理
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        data: paginatedData,
        total: filteredData.length
    };
};

// 自定义字段数据
const fetchCustomData = async () => {
    const customData = Array.from({ length: 10 }, (_, index) => ({
        id: `${index + 1}`,
        name: `自定义选项 ${index + 1}`
    }));

    return {
        data: customData,
        total: customData.length
    };
};

// Select 组件引用
const selectRefs = {
    basic: ref(),
    multiple: ref(),
    search: ref(),
    remote: ref(),
    custom: ref()
};

// 事件处理
const handleRefresh = async () => {
    try {
        // 刷新所有 Select 组件
        await Promise.all(Object.values(selectRefs).map(ref => ref.value?.refresh()));
        ElMessage.success('数据已刷新');
    } catch (error) {
        console.error('刷新失败:', error);
        ElMessage.error('刷新失败');
    }
};

const handleReset = () => {
    // 重置表单数据
    form.basicId = '';
    form.multipleIds = [];
    form.searchId = '';
    form.remoteId = '';
    form.customId = '';
    ElMessage.success('数据已重置');
};
</script>

<style scoped lang="scss">
.select-test-container {
    padding: 20px;

    .card-header {
        h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 500;
        }
    }

    .form-item-help {
        margin-top: 8px;
    }

    .test-actions {
        margin-top: 20px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
    }

    :deep(.el-form-item) {
        margin-bottom: 24px;
    }
}
</style>
