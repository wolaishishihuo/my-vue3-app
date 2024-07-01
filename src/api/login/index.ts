import http from '@/http';
export const login = params => {
    return http.post<{ token: string }>('/auth/login', params);
};

export const getCaptcha = () => {
    return http.get<{ key: string; svg: string; text: string }>('/captcha');
};
