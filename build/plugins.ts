import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite';

export const vitePlugins = (viteEnv: ViteEnv): PluginOption[] => {
    const { VITE_GLOB_APP_TITLE } = viteEnv;
    return [
        vue(),
        // 注入变量到 html 文件
        createHtmlPlugin({
            minify: true,
            inject: {
                data: { title: VITE_GLOB_APP_TITLE }
            }
        }),
        // script setup 上添加name属性
        vueSetupExtend({})
    ];
};
