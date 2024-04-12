// https://vitejs.dev/config/
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import { vitePlugins } from './build/plugins';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root) as unknown as ViteEnv;

    return {
        base: env.VITE_PUBLIC_PATH,
        plugins: vitePlugins(env),
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
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
            proxy: {
                '/auth': {
                    target: 'http://localhost:3000',
                    changeOrigin: true
                }
            }
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
