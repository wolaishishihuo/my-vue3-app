import { Router, createRouter, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { staticRouter } from './modules/staticRouter';
import NProgress from '@/config/nprogress';
// 路由实例
const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [...staticRouter],
    strict: false,
    scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由跳转开始
 * */
router.beforeEach(async (to, from, next) => {
    NProgress.start();
    // 动态设置标题
    const title = import.meta.env.VITE_GLOB_APP_TITLE;
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;
    next();
});

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
    NProgress.done();
    console.warn('路由错误', error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
    NProgress.done();
});

export async function setupRouter(app: App) {
    app.use(router);
    // 路由准备就绪后挂载APP实例
    await router.isReady();
}
export default router;
