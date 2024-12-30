import { useAuthStore } from '@/stores/modules/auth';

// 按钮权限控制
export default function useAuthButtons() {
    const authStore = useAuthStore();
    const hasPermission = (permission: string | string[]) => {
        if (Array.isArray(permission)) {
            return permission.some(p => authStore.hasButtonPermission(p));
        }
        return authStore.hasButtonPermission(permission);
    };
    return { hasPermission };
}
