import { PluginOption } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export const vitePlugins = (viteEnv: any): PluginOption[] => {
    const { VITE_GLOB_APP_TITLE } = viteEnv;
    return [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
            dts: 'typings/auto-import.d.ts'
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dts: 'typings/components.d.ts'
        }),
        // 注入变量到 html 文件
        createHtmlPlugin({
            minify: true,
            inject: {
                data: { title: VITE_GLOB_APP_TITLE }
            }
        })
    ];
};
