import type { Directive } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';
import { useUserStore } from '@/stores/modules/user';

export const permission: Directive = {
    mounted(el: HTMLElement, binding) {
        const { value } = binding;
        const authStore = useAuthStore();
        const userStore = useUserStore();

        if (!value) return;

        // 超级管理员直接放行
        if (userStore.roles.includes('super_admin')) return;

        // 验证权限
        if (!authStore.hasButtonPermission(value)) {
            el.parentNode?.removeChild(el);
        }
    }
};
