import http from '@/http';
import { Captcha, Login, Register } from '../interface';

export const login = params => {
    return http.post<Login.Res>('/auth/login', params);
};
export const register = params => {
    return http.post<Register.Res>('/auth/register', params);
};
export const getCaptcha = () => {
    return http.get<Captcha.Res>('/captcha');
};
