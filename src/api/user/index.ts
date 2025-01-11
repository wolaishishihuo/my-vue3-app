import http from '@/http';

// 获取用户信息
export const getUserInfoApi = () => {
    return http.get<User.UserInfo>('/user/findUser');
};
