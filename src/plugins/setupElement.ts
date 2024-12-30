import { App } from 'vue';
import ElementPlus from 'element-plus';
import * as Icons from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包
export const setupElement = (app: App) => {
    Object.keys(Icons).forEach(key => {
        app.component(key, Icons[key as keyof typeof Icons]);
    });
    app.use(ElementPlus, { locale: zhCn });
};
