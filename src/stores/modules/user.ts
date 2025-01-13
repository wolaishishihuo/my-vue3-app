import { defineStore } from 'pinia';
import router, { resetRouter } from '@/routers';
import piniaPersistConfig from '../helper';
import useLocalCache from '@/hooks/useLocalCache';
import { EXCLUDE_CACHE_KEYS } from '@/config';
import { getUserInfoApi, getUserRoleApi } from '@/api/user';

export const useUserStore = defineStore('user', {
    state: () => ({
        accessToken: '',
        refreshToken: '',
        userInfo: null as User.UserInfo | null,
        permissions: [] as string[]
    }),
    getters: {
        isLogin: state => !!state.accessToken,
        userRoles: state => state.userInfo?.roles,
        userPermissions: state => state.permissions
    },
    actions: {
        // 设置 Token
        setAccessToken(token: string) {
            this.accessToken = token;
        },
        setRefreshToken(token: string) {
            this.refreshToken = token;
        },
        // 获取用户信息
        async getUserInfo() {
            try {
                Promise.all([getUserInfoApi(), getUserRoleApi()]).then(([userInfo, roles]) => {
                    this.userInfo = userInfo.data;
                    this.userInfo.roles = roles.data;
                });
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
            this.accessToken = '';
            this.refreshToken = '';
            this.userInfo = null;
            this.permissions = [];
            // 清除本地缓存
            const { clearCache } = useLocalCache();
            clearCache(EXCLUDE_CACHE_KEYS);
        }
    },
    persist: piniaPersistConfig('user-store', ['accessToken', 'refreshToken', 'userInfo'])
});
