import { App } from 'vue';
// element plus
import ElementPlus from 'element-plus';
// element icons
import * as Icons from '@element-plus/icons-vue';

export const setupElement = (app: App) => {
    // register the element Icons component
    Object.keys(Icons).forEach(key => {
        app.component(key, Icons[key as keyof typeof Icons]);
    });
    app.use(ElementPlus);
};
