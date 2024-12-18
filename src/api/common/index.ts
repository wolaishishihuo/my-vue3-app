// 获取城市
export const getCity = async (params: { location: string; key: string }) => {
    const response = await fetch(`https://geoapi.qweather.com/v2/city/lookup?location=${params.location}&key=${params.key}`, {
        method: 'GET'
    });
    return await response.json();
};

// 首页获取城市天气
export const getCityWeather = async (params: { location: string; key: string }) => {
    const response = await fetch(`https://devapi.qweather.com/v7/weather/now?location=${params.location}&key=${params.key}`, {
        method: 'GET'
    });
    return await response.json();
};
