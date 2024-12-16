import http from '@/http';
export const getUserInfo = () => {
    return http.get<Auth.UserInfo>('/user/getUserInfo');
};
