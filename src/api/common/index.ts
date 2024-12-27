// 获取城市
export const getAMapLocation = async (params: { ip: string; key: string }) => {
    const response = await fetch(`https://restapi.amap.com/v3/ip?ip=${params.ip}&output=JSON&key=${params.key}`, {
        method: 'GET'
    });
    return await response.json();
};

// 首页获取城市天气
export const getWeatherInfo = async (params: { location: string; key: string }) => {
    const response = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${params.location}&key=${params.key}`, {
        method: 'GET'
    });
    return await response.json();
};

// 获取ip地址
export const getIpAddress = async () => {
    const response = await fetch('https://ipapi.co/json/');
    return await response.json();
};
