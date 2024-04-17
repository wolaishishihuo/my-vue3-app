import { defineStore } from 'pinia';
import { AuthState } from '../interface';
import piniaPersistConfig from '../helper';
import { getFlatList } from '@/utils/array';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        // 当前路由name
        routeName: '',
        // 按钮权限列表
        authButtonList: {},
        // 菜单权限列表
        authMenuList: []
    }),
    getters: {
        // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
        flatMenuListGet: state => getFlatList<Menu.MenuOptions>(state.authMenuList),
        // 菜单权限列表 ==> 这里的菜单没有经过任何处理
        authMenuListGet: state => state.authMenuList
    },
    actions: {
        async getAuthButtonList() {
            this.authButtonList = {};
        },
        async getAuthMenuList() {
            this.authMenuList = [];
        },
        setRouteName(routeName: string) {
            this.routeName = routeName;
        }
    },
    persist: piniaPersistConfig('auth')
});
