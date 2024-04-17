import { HOME_URL } from '@/config';
import { RouteRecordRaw } from 'vue-router';

export const staticRouter: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: HOME_URL
    },
    {
        path: '/layout',
        name: 'layout',
        redirect: HOME_URL,
        children: [],
        component: () => import('@/layouts/index.vue')
    }
];
