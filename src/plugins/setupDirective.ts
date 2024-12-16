import { App } from 'vue';
import { permission } from '@/directives/permission';

export const setupDirective = (app: App) => {
    app.directive('permission', permission);
};
