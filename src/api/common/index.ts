import http from '@/http';

// 获取城市天气信息
export const getWeatherInfo = async () => {
    return http.get('/thirdParty/weather');
};
