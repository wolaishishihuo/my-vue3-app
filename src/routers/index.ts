import { Router, createRouter, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { staticRouter } from './modules/staticRouter';

// 路由实例
const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [...staticRouter],
    strict: false,
    scrollBehavior: () => ({ left: 0, top: 0 })
});

export async function setupRouter(app: App) {
    app.use(router);
    // 路由准备就绪后挂载APP实例
    await router.isReady();
}
export default router;
