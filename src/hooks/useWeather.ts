import { getCity, getCityWeather } from '@/api/common';
import { WEATHER_KEY } from '@/config';
import { ref } from 'vue';

export const useWeather = (cityName: string) => {
    const weatherInfo = ref({
        obsTime: '',
        temp: '',
        feelsLike: '',
        icon: '',
        text: '',
        wind360: '',
        windDir: '',
        windScale: '',
        windSpeed: '',
        humidity: '',
        precip: '',
        pressure: '',
        vis: '',
        cloud: '',
        dew: ''
    });
    // 获取天气数据的方法
    const getWeatherData = async () => {
        try {
            // 1. 先获取城市ID
            const { location = [] } = await getCity({ location: cityName, key: WEATHER_KEY });
            //  2. 根据城市ID获取天气数据
            const cityId = location.find(item => item.name === cityName)?.id;
            if (cityId) {
                const { now } = await getCityWeather({ location: cityId, key: WEATHER_KEY });
                weatherInfo.value = now;
            } else {
                throw new Error('未找到城市信息');
            }
        } catch (error) {
            console.error('获取天气数据失败:', error);
            throw error;
        }
    };
    getWeatherData();
    return {
        weatherInfo
    };
};
