// src/stores/modules/user.ts
import { defineStore } from 'pinia';
import { getUserInfo } from '@/api/user';
import { login } from '@/api/login';
import { resetRouter } from '@/routers';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null as Auth.UserInfo | null,
        roles: [] as string[],
        permissions: [] as string[]
    }),
    getters: {
        isLogin: state => !!state.token,
        userRoles: state => state.roles,
        userPermissions: state => state.permissions
    },
    actions: {
        // 登录
        async login(params: Auth.LoginParams) {
            try {
                const { data } = await login(params);
                this.token = data.token;
                return await this.getUserInfo();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        // 获取用户信息
        async getUserInfo() {
            try {
                const { data } = await getUserInfo();
                this.userInfo = data;
                this.roles = data.roles;
                this.permissions = data.permissions;
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        // 登出
        async logout() {
            this.resetUserInfo();
            resetRouter();
        },
        // 重置用户信息
        resetUserInfo() {
            this.token = '';
            this.userInfo = null;
            this.roles = [];
            this.permissions = [];
        }
    },
    persist: {
        key: 'user-store',
        storage: localStorage,
        paths: ['token']
    }
});
