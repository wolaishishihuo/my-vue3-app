import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';

/**
 * 按钮权限指令
 * @example v-permission="'todo:add'"  // 单个权限
 * @example v-permission="['todo:add', 'todo:edit']"  // 多个权限，满足一个即可
 * @example v-permission.all="['todo:add', 'todo:edit']"  // 多个权限，需要同时满足
 */
export const permission: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value, modifiers } = binding;
        const authStore = useAuthStore();
        console.log(value, modifiers);
        // 检查权限的函数
        const checkPermission = (permissions: string | string[]): boolean => {
            if (!permissions) {
                throw new Error('need permission! Like v-permission="\'todo:add\'"');
            }

            // 转换为数组统一处理
            const permissionList = Array.isArray(permissions) ? permissions : [permissions];

            if (permissionList.length === 0) return true;

            // 根据修饰符决定验证方式
            if (modifiers.all) {
                // 需要满足所有权限
                return permissionList.every(permission => authStore.hasButtonPermission(permission));
            } else {
                // 满足任一权限即可
                return permissionList.some(permission => authStore.hasButtonPermission(permission));
            }
        };

        // 检查权限并处理元素
        if (!checkPermission(value)) {
            el.parentNode?.removeChild(el);
        }
    },

    updated(el: HTMLElement, binding: DirectiveBinding) {
        // 当绑定的值发生变化时重新检查权限
        if (binding.value !== binding.oldValue) {
            const { value, modifiers } = binding;
            const authStore = useAuthStore();

            const hasPermission = Array.isArray(value)
                ? modifiers.all
                    ? value.every(permission => authStore.hasButtonPermission(permission))
                    : value.some(permission => authStore.hasButtonPermission(permission))
                : authStore.hasButtonPermission(value);

            if (!hasPermission) {
                el.parentNode?.removeChild(el);
            }
        }
    }
};
