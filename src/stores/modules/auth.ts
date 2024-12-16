import { defineStore } from 'pinia';
import { getFlatList } from '@/utils/array';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // 当前路由name
        routeName: '',
        buttonPermissions: {} as { [key: string]: string[] },
        authMenuList: [] as Menu.MenuOptions[],
        permissionCache: new Map<string, boolean>()
    }),
    getters: {
        // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
        flatMenuListGet: state => getFlatList<Menu.MenuOptions>(state.authMenuList),
        // 菜单权限列表 ==> 这里的菜单没有经过任何处理
        authMenuListGet: state => state.authMenuList,
        authButtonListGet: state => state.buttonPermissions,
        // 当前路由权限
        currentRoutePermissions(): string[] {
            return this.buttonPermissions[this.routeName] || [];
        }
    },
    actions: {
        // 获取按钮权限列表
        async getAuthButtonList() {
            const { data } = await import('@/assets/json/authButtonList.json');
            this.buttonPermissions = data;
            return data;
        },

        // 获取菜单权限列表
        async getAuthMenuList() {
            const { data } = await import('@/assets/json/authMenuList.json');
            this.authMenuList = data;
            return this.authMenuList;
        },
        setRouteName(routeName: string) {
            this.routeName = routeName;
        },
        // 重置权限信息
        resetAuthInfo() {
            this.buttonPermissions = {};
            this.authMenuList = [];
            this.permissionCache.clear();
        },

        // 检查按钮权限
        hasButtonPermission(permission: string): boolean {
            const cacheKey = `${this.routeName}:${permission}`;
            if (this.permissionCache.has(cacheKey)) {
                return this.permissionCache.get(cacheKey)!;
            }
            const result = this.currentRoutePermissions.includes(permission);
            this.permissionCache.set(cacheKey, result);
            return result;
        }
    }
});
