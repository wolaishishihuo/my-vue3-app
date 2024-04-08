import { RouteRecordRaw, Router, createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About/index.vue'),
    },
];

// 路由实例
const router: Router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
