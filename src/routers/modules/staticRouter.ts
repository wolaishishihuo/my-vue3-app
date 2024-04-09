import { RouteRecordRaw } from 'vue-router';

export const staticRouter: RouteRecordRaw[] = [
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/index.vue')
    }
];
