export default function useEnv(): Partial<ViteEnv> {
    const { VITE_GLOB_APP_TITLE, VITE_BASE_URL, VITE_USER_NODE_ENV, VITE_PUBLIC_PATH } = import.meta.env;
    return {
        VITE_GLOB_APP_TITLE,
        VITE_BASE_URL,
        VITE_USER_NODE_ENV,
        VITE_PUBLIC_PATH
    };
}
