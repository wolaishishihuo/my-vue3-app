import { getWeatherInfo } from '@/api/common';
import { ref, onMounted } from 'vue';
import { useAsyncState } from '@vueuse/core';
import type { Ref } from 'vue';
import useLocalCache from './useLocalCache';

interface WeatherInfo {
    weather: string;
    temperature: string;
    temperature_float: string;
    winddirection: string;
    windpower: string;
    humidity: string;
    humidity_float: string;
    reporttime: string;
    province: string;
    city: string;
    adcode: string;
}

interface UseAMapLocationWeatherReturn {
    weatherInfo: Ref<WeatherInfo | null>;
    isLoading: Ref<boolean>;
    error: Ref<string | null>;
}

export const useAMapLocationWeather = (): UseAMapLocationWeatherReturn => {
    const weatherInfo = ref<WeatherInfo | null>(null);
    const error = ref<string | null>(null);
    const { setCache, getCache } = useLocalCache();

    const { execute, isLoading } = useAsyncState(
        async () => {
            const weatherResponse = await getWeatherInfo();
            weatherInfo.value = weatherResponse.data as WeatherInfo;
            setCache('weatherInfo', weatherInfo.value);
        },
        null,
        { immediate: false }
    );

    onMounted(async () => {
        try {
            const cachedWeatherInfo = getCache('weatherInfo');
            if (cachedWeatherInfo) {
                weatherInfo.value = cachedWeatherInfo as WeatherInfo;
            }
            if (!weatherInfo.value) {
                await execute();
            }
        } catch (err) {
            error.value = (err as Error).message;
        }
    });

    return { weatherInfo, isLoading, error };
};
