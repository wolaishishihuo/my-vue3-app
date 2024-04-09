import { createApp, App } from 'vue';
import APP from './App.vue';
import { setupRouter } from './routers';
import { setupAssets } from '@/plugins/index';
import { setupStore } from '@/stores';

const app: App = createApp(APP); // 创建vue实例

// 注册插件
function setupPlugins() {
    setupAssets();
}
// 初始化应用
async function setupApp() {
    // 挂载pinia状态管理
    setupStore(app);
    // 挂载路由
    await setupRouter(app);
    app.mount('#app');
}
setupPlugins();
setupApp();
