// src/types/auth.d.ts
declare namespace Auth {
    // 用户信息
    interface UserInfo {
        id: string;
        username: string;
        realName: string;
        avatar: string;
        roles: string[];
        permissions: string[];
    }

    // 登录参数
    interface LoginParams {
        username: string;
        password: string;
    }

    // 登录响应
    interface LoginResult {
        token: string;
    }
}
