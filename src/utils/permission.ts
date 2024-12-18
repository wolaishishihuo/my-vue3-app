import { RouteLocationNormalized } from 'vue-router';

interface RouteCheck {
    path: string;
    name: string;
    roles?: string[];
}

/**
 * 移除路径中的动态参数
 * @param path 路由路径
 * @returns 处理后的路径
 */
const removePathParams = (path: string): string => {
    return path.replace(/\/:[^/]+/g, '');
};

/**
 * 检查路由权限
 * @param route 当前路由
 * @param menuList 菜单列表
 * @param userRoles 用户角色
 * @returns 是否有权限
 */
const checkPermissionRecursive = (route: RouteCheck, menuList: Menu.MenuOptions[], userRoles: string[]): boolean => {
    // 处理当前路由路径，移除动态参数
    const currentPath = removePathParams(route.path);

    // 遍历菜单列表
    for (const menu of menuList) {
        // 处理菜单路径，移除动态参数
        const menuPath = removePathParams(menu.path);

        // 检查路径或名称是否匹配
        if (menuPath === currentPath || menu.name === route.name) {
            // 如果路由没有指定角色要求，则允许访问
            if (!route.roles || route.roles.length === 0) {
                return true;
            }

            // 检查用户角色是否满足要求
            return route.roles.some(role => userRoles.includes(role));
        }

        // 递归检查子菜单
        if (menu.children && menu.children.length > 0) {
            const hasPermission = checkPermissionRecursive(route, menu.children, userRoles);
            if (hasPermission) {
                return true;
            }
        }
    }

    return false;
};

/**
 * 检查路由访问权限
 * @param to 目标路由
 * @param menuList 菜单列表
 * @param userRoles 用户角色
 * @returns 是否有权限访问
 */
export function hasPermission(to: RouteLocationNormalized, menuList: Menu.MenuOptions[], userRoles: string[] = []): boolean {
    // 超级管理员直接放行
    if (userRoles.includes('super_admin')) {
        return true;
    }

    return checkPermissionRecursive(
        {
            path: to.path,
            name: to.name as string,
            roles: to.meta?.roles as string[]
        },
        menuList,
        userRoles
    );
}
