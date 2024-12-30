import { getAMapLocation, getWeatherInfo } from '@/api/common';
import { AMAP_CONFIG } from '@/config';
import { useUserStore } from '@/stores/modules/user';
import { ref, onMounted } from 'vue';
import { useAsyncState } from '@vueuse/core';
import type { Ref } from 'vue';
import useLocalCache from './useLocalCache';

interface LocationInfo {
    province: string;
    city: string;
    adcode: string;
}

interface WeatherInfo {
    weather: string;
    temperature: string;
    temperature_float: string;
    winddirection: string;
    windpower: string;
    humidity: string;
    humidity_float: string;
    reporttime: string;
}

interface UseAMapLocationWeatherReturn {
    locationInfo: Ref<LocationInfo | null>;
    weatherInfo: Ref<WeatherInfo | null>;
    isLoading: Ref<boolean>;
    error: Ref<string | null>;
}

export const useAMapLocationWeather = (): UseAMapLocationWeatherReturn => {
    const locationInfo = ref<LocationInfo | null>(null);
    const weatherInfo = ref<WeatherInfo | null>(null);
    const error = ref<string | null>(null);
    const { setCache, getCache } = useLocalCache();
    const userStore = useUserStore();

    const { execute, isLoading } = useAsyncState(
        async () => {
            if (!userStore.ipAddress) {
                throw new Error('未获取到IP地址');
            }
            const locationResponse = await getAMapLocation({ ip: userStore.ipAddress, key: AMAP_CONFIG.key });
            const weatherResponse = await getWeatherInfo({ location: locationResponse.city, key: AMAP_CONFIG.key });

            locationInfo.value = {
                province: locationResponse.province,
                city: locationResponse.city,
                adcode: locationResponse.adcode
            };
            setCache('locationInfo', locationInfo.value);

            weatherInfo.value = weatherResponse.lives[0] || {};
            setCache('weatherInfo', weatherInfo.value);
        },
        null,
        { immediate: false }
    );

    onMounted(async () => {
        try {
            const cachedLocationInfo = getCache('locationInfo');
            const cachedWeatherInfo = getCache('weatherInfo');

            if (cachedLocationInfo) {
                locationInfo.value = cachedLocationInfo as LocationInfo;
            }
            if (cachedWeatherInfo) {
                weatherInfo.value = cachedWeatherInfo as WeatherInfo;
            }

            if (!locationInfo.value || !weatherInfo.value) {
                await execute();
            }
        } catch (err) {
            error.value = (err as Error).message;
        }
    });

    return { locationInfo, weatherInfo, isLoading, error };
};
