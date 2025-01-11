import http from '@/http';

// 获取城市天气信息
export const getWeatherInfo = async () => {
    return http.get('/thirdParty/weather');
};

// 获取仓库提交记录
export const githubCommits = async (params: { per_page?: number; page?: number }) => {
    const { per_page = 10, page = 1 } = params;
    return http.get(`/thirdParty/githubCommits`, { per_page, page });
};
