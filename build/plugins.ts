import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';

export const vitePlugins = (viteEnv: ViteEnv): PluginOption[] => {
    const { VITE_GLOB_APP_TITLE } = viteEnv;
    return [
        vue(),
        vueJsx(),
        // 注入变量到 html 文件
        createHtmlPlugin({
            minify: true,
            inject: {
                data: { title: VITE_GLOB_APP_TITLE }
            }
        }),
        // script setup 上添加name属性
        vueSetupExtend({}),
        creatCompression(viteEnv)
    ];
};

const creatCompression = (viteEnv: ViteEnv): PluginOption | PluginOption[] => {
    const { VITE_BUILD_COMPRESS } = viteEnv;
    const compressList = VITE_BUILD_COMPRESS.split(',');
    const plugins: PluginOption[] = [];
    if (compressList.includes('gzip')) {
        plugins.push(
            viteCompression({
                algorithm: 'gzip',
                ext: '.gz',
                deleteOriginFile: true
            })
        );
    }
    return plugins;
};
