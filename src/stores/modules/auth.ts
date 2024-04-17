import { defineStore } from 'pinia';
import { AuthState } from '../interface';
import piniaPersistConfig from '../helper';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        // 当前路由name
        routeName: '',
        // 按钮权限列表
        authButtonList: {},
        // 菜单权限列表
        authMenuList: []
    }),
    actions: {
        getAuthButtonList() {
            this.authButtonList = {};
        },
        getAuthMenuList() {
            this.authMenuList = [];
        },
        setRouteName(routeName: string) {
            this.routeName = routeName;
        }
    },
    persist: piniaPersistConfig('auth')
});
