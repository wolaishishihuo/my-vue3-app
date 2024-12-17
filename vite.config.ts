// https://vitejs.dev/config/
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import { vitePlugins } from './build/plugins';
import { creatProxy } from './build/proxy';
import path from 'path';
import { wrapperEnv } from './build/wrapperEnv';
import pkg from './package.json';
import { dayjs } from 'element-plus';
const { version, dependencies, devDependencies, name } = pkg;
const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
};
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root) as unknown as ViteEnv;
    const viteEnv = wrapperEnv(env);
    return {
        root,
        base: env.VITE_PUBLIC_PATH,
        plugins: vitePlugins(env),
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        define: {
            __APP_INFO__: JSON.stringify(__APP_INFO__)
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // 配置 SCSS 预处理器选项
                    api: 'modern' // 或 'modern'
                }
            }
        },

        esbuild: {
            pure: env.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
        },
        server: {
            host: '0.0.0.0',
            port: env.VITE_PORT,
            open: env.VITE_OPEN,
            cors: true,
            proxy: creatProxy(viteEnv.VITE_PROXY)
        },
        build: {
            outDir: 'dist',
            minify: 'esbuild',
            sourcemap: false,
            // 禁用 gzip 压缩大小报告，可略微减少打包时间
            reportCompressedSize: false,
            // 规定触发警告的 chunk 大小
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    // Static resource classification and packaging
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
                }
            }
        }
    };
});
