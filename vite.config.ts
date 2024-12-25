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
    const viteEnv = wrapperEnv(loadEnv(mode, root)) as ViteEnv;
    return {
        root,
        base: viteEnv.VITE_PUBLIC_PATH,
        plugins: vitePlugins(viteEnv),
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
                    additionalData: `
                        @import "@/styles/abstracts/variables.scss";
                        @import "@/styles/abstracts/mixins.scss";
                    `
                }
            }
        },
        esbuild: {
            pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
        },
        server: {
            host: '0.0.0.0',
            port: viteEnv.VITE_PORT,
            open: viteEnv.VITE_OPEN,
            cors: true,
            proxy: creatProxy(viteEnv.VITE_PROXY || [])
        },
        build: {
            outDir: 'dist',
            minify: 'esbuild',
            sourcemap: true,
            reportCompressedSize: false,
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
                }
            }
        }
    };
});
