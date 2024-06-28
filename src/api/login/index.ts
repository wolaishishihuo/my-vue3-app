import http from '@/http';
export const login = params => {
    return http.post<{ token: string }>('/auth/login', params);
};
