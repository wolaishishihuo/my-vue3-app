<template>
    <div class="business-example">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>城市选择示例</span>
                </div>
            </template>

            <el-form :model="form" label-width="100px">
                <el-form-item label="城市">
                    <Select
                        v-model="form.cityId"
                        :field-names="fieldNames"
                        :options="displayOptions"
                        :loading="loading"
                        :show-pagination="true"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :total="total"
                        @search="handleSearch"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        @change="handleChange"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                </el-form-item>
            </el-form>

            <!-- 选中的城市信息 -->
            <div v-if="selectedCity" class="selected-info">
                <h4>已选择城市信息：</h4>
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="城市名称">{{ selectedCity.name }}</el-descriptions-item>
                    <el-descriptions-item label="城市编码">{{ selectedCity.id }}</el-descriptions-item>
                    <el-descriptions-item label="天气">{{ weather?.temp }}°C</el-descriptions-item>
                    <el-descriptions-item label="天气状况">{{ weather?.text }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="businessExample">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import Select from '@/components/Select/index.vue';
import { useSelect } from '@/components/Select/useSelect';
import type { FieldNames, FetchParams } from '@/components/Select/types';
import { getCity, getCityWeather } from '@/api/common';

interface CityInfo {
    id: string;
    name: string;
}

interface WeatherInfo {
    temp: string;
    text: string;
}

// 表单数据
const form = ref({
    cityId: ''
});

// 字段名配置
const fieldNames: FieldNames = {
    label: 'name',
    value: 'id'
};

// 选中的城市信息
const selectedCity = ref<CityInfo | null>(null);
const weather = ref<WeatherInfo | null>(null);

// API Key（实际应用中应该从环境变量获取）
const API_KEY = 'your_api_key';

// 获取城市数据
const fetchCityData = async (params: FetchParams): Promise<{ data: CityInfo[]; total: number }> => {
    try {
        const response = await getCity({
            location: params.query,
            key: API_KEY
        });

        if (response.code === '200') {
            const cities = response.location.map((city: any) => ({
                id: city.id,
                name: city.name
            }));

            return {
                data: cities,
                total: cities.length
            };
        }

        return {
            data: [],
            total: 0
        };
    } catch (error) {
        console.error('Failed to fetch cities:', error);
        return {
            data: [],
            total: 0
        };
    }
};

// 获取天气信息
const fetchWeather = async (cityId: string) => {
    try {
        const response = await getCityWeather({
            location: cityId,
            key: API_KEY
        });

        if (response.code === '200') {
            weather.value = {
                temp: response.now.temp,
                text: response.now.text
            };
        }
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        weather.value = null;
    }
};

// 使用Select组件的Hook
const { displayOptions, loading, currentPage, pageSize, total, handleSearch, handleSizeChange, handleCurrentChange, refresh } = useSelect<CityInfo>({
    fieldNames,
    config: {
        remoteSearch: true,
        pagination: true,
        pageSize: 10,
        debounceTime: 500
    },
    fetchData: fetchCityData
});

// 监听选中值变化
watch(
    () => form.value.cityId,
    async newValue => {
        if (newValue) {
            const city = displayOptions.value.find(item => item.id === newValue);
            if (city) {
                selectedCity.value = city;
                await fetchWeather(newValue);
            }
        } else {
            selectedCity.value = null;
            weather.value = null;
        }
    }
);

// 选择事件处理
const handleChange = (value: string) => {
    console.log('Selected city:', value);
};

// 表单提交
const handleSubmit = () => {
    if (!form.value.cityId) {
        ElMessage.warning('请选择城市');
        return;
    }

    console.log('Form submitted:', {
        cityId: form.value.cityId,
        cityName: selectedCity.value?.name,
        weather: weather.value
    });
};
</script>

<style scoped lang="scss">
.business-example {
    padding: 20px;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .selected-info {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--el-border-color-lighter);

        h4 {
            margin: 0 0 16px;
            font-size: 16px;
            color: var(--el-text-color-primary);
        }
    }
}
</style>
