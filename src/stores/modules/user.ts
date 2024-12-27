import { defineStore } from 'pinia';
import router, { resetRouter } from '@/routers';
import piniaPersistConfig from '../helper';
import { getIpAddress } from '@/api/common';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null as User.UserInfo | null,
        roles: [] as string[],
        permissions: [] as string[],
        ipAddress: ''
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
                const { data } = await import('@/assets/json/userInfo.json');
                this.userInfo = data;
                this.roles = data.roles;
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        // 获取ip地址
        async getIpAddress() {
            try {
                const response = await getIpAddress();
                console.log(response);
                this.ipAddress = response.ip;
            } catch (err) {
                console.error('获取IP失败:', err);
                throw err;
            }
        },
        // 登出
        async logout() {
            this.resetUserInfo();
            resetRouter();
            router.push('/login');
        },
        // 重置用户信息
        resetUserInfo() {
            this.token = '';
            this.userInfo = null;
            this.roles = [];
            this.permissions = [];
        }
    },
    persist: piniaPersistConfig('user-store', ['token', 'userInfo', 'ipAddress'])
});
