import { RouteRecordRaw, Router, createRouter, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import { errorRouter, staticRouter } from './modules/staticRouter';
import { initDynamicRouter } from './modules/dynamicRouter';
import { ROUTER_WHITE_LIST, LOGIN_URL } from '@/config';
import { useUserStore } from '@/stores/modules/user';
import { useAuthStore } from '@/stores/modules/auth';
import NProgress from '@/config/nprogress';

// 路由实例
const router: Router = createRouter({
    history: createWebHistory('/v3/web/'),
    routes: [...staticRouter, ...errorRouter] as RouteRecordRaw[],
    strict: false,
    scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由跳转开始
 * */
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const authStore = useAuthStore();

    // 进度开始
    NProgress.start();

    // 动态设置标题
    const title = import.meta.env.VITE_GLOB_APP_TITLE;
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

    // 判断是否前往login页面,如果有token则继续当前页
    if (to.path.toLocaleLowerCase() == LOGIN_URL) {
        if (userStore.token) return next(from.fullPath);
        resetRouter();
        return next();
    }

    // 白名单放行
    if (ROUTER_WHITE_LIST.includes(to.path)) return next();

    // 判断是否有 Token，没有重定向到 login 页面
    if (!userStore.token) return next({ path: LOGIN_URL, replace: true });

    if (!authStore.authMenuListGet.length) {
        try {
            console.log(userStore.token);
            await initDynamicRouter();
            // 确保路由已经添加
            return next({ ...to, replace: true });
        } catch (error) {
            // 处理动态路由加载失败的情况
            console.error('动态路由加载失败:', error);
            return next({ path: '/500', replace: true });
        }
    }
    // 如果要访问的路由不存在，重定向到 404
    if (to.matched.length === 0) {
        return next({ path: '/404', replace: true });
    }
    console.log('当前路由:', to.path);
    console.log(
        '可用路由:',
        router.getRoutes().map(route => route.path)
    );
    next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
    const authStore = useAuthStore();
    authStore.flatMenuListGet.forEach(route => {
        const { name } = route;
        if (name && router.hasRoute(name)) router.removeRoute(name);
    });
};

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
