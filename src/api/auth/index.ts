import http from '@/http';

// 登录
export const loginApi = (params: Auth.LoginParams) => {
    return http.post<Auth.LoginResult>('/user/login', params);
};

// 注册
export const registerApi = (params: Auth.RegisterParams) => {
    return http.post<Auth.RegisterResult>('/user/register', params);
};

// 获取验证码
export const getCaptchaApi = () => {
    return http.get<Auth.GetCaptchaResult>('/captcha');
};
