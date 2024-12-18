import type { RouteLocationNormalized } from 'vue-router';

interface PermissionCheck {
    path: string;
    name?: string;
    roles?: string[];
}

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

function checkPermissionRecursive(check: PermissionCheck, menuList: Menu.MenuOptions[], userRoles: string[]): boolean {
    for (const menu of menuList) {
        // 路径匹配检查
        const pathMatch = menu.path === check.path;

        // 路由名称检查
        const nameMatch = check.name ? menu.name === check.name : true;

        // 角色权限检查
        const hasRole = check.roles?.length ? check.roles.some(role => userRoles.includes(role)) : true;
        // 所有条件都满足才算有权限
        if (pathMatch && nameMatch && hasRole) {
            return true;
        }

        // 递归检查子菜单
        if (menu.children?.length) {
            if (checkPermissionRecursive(check, menu.children, userRoles)) {
                return true;
            }
        }
    }

    return false;
}
