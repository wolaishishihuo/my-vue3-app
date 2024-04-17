/* Menu */
declare namespace Menu {
    interface MenuOptions {
        path: string;
        name: string;
        component?: string | (() => Promise<unknown>);
        redirect?: string;
        meta: MetaProps;
        children?: MenuOptions[];
    }
    interface MetaProps {
        icon: string;
        title: string;
        activeMenu?: string;
        isLink?: string;
        isHide: boolean;
        isFull: boolean;
        isAffix: boolean;
        isKeepAlive: boolean;
    }
}
/* ViteEnv */
declare interface ViteEnv {
    VITE_USER_NODE_ENV: 'development' | 'production';
    VITE_GLOB_APP_TITLE: string;
    VITE_PORT: number;
    VITE_OPEN: boolean;
    VITE_REPORT: boolean;
    VITE_ROUTER_MODE: 'hash' | 'history';
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_DROP_CONSOLE: boolean;
    VITE_PWA: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_BASE_URL: string;
    VITE_API_URL: string;
    VITE_PROXY: [string, string][];
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
    pkg: {
        name: string;
        version: string;
        dependencies: Recordable<string>;
        devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
};
