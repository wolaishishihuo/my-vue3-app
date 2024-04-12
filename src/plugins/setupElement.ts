import { App } from 'vue';
import ElementPlus from 'element-plus';
import * as Icons from '@element-plus/icons-vue';

export const setupElement = (app: App) => {
    Object.keys(Icons).forEach(key => {
        app.component(key, Icons[key as keyof typeof Icons]);
    });
    app.use(ElementPlus);
};
