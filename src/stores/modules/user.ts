import { defineStore } from 'pinia';
import { getUserInfoApi } from '@/api/user';
import { resetRouter } from '@/routers';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null as User.UserInfo | null,
        roles: [] as string[],
        permissions: [] as string[]
    }),
    getters: {
        isLogin: state => !!state.token,
        userRoles: state => state.roles,
        userPermissions: state => state.permissions
    },
    actions: {
        // 设置 Token
        setToken(token: string) {
            this.token = token;
        },
        // 获取用户信息
        async getUserInfo() {
            try {
                const { data } = await getUserInfoApi();
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
