import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vitejs.dev/config/

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root);
    console.log(env);

    return {
        base: env.VITE_PUBLIC_PATH,
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        esbuild: {
            pure: env.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
        },
        build: {
            outDir: 'dist',
            // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
            // minify: 'terser',
            // terserOptions: {
            //     compress: {
            //         drop_console: viteEnv.VITE_DROP_CONSOLE,
            //         drop_debugger: true
            //     }
            // },
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
