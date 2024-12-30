import { defineStore } from 'pinia';
import router, { resetRouter } from '@/routers';
import piniaPersistConfig from '../helper';
import useLocalCache from '@/hooks/useLocalCache';
import { EXCLUDE_CACHE_KEYS } from '@/config';

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
                const { data } = await import('@/assets/json/userInfo.json');
                this.userInfo = data;
                this.roles = data.roles;
                await new Promise(resolve => setTimeout(resolve, 1000)); // 添加1秒延时
                return data;
            } catch (error) {
                return Promise.reject(error);
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
            // 清除本地缓存
            const { clearCache } = useLocalCache();
            clearCache(EXCLUDE_CACHE_KEYS);
        }
    },
    persist: piniaPersistConfig('user-store', ['token', 'userInfo'])
});
