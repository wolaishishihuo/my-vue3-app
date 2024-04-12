export default function useEnv() {
    const { MODE, VITE_GLOB_APP_TITLE, VITE_BASE_API, VITE_USER_NODE_ENV, VITE_PUBLIC_PATH } = import.meta.env;
    return {
        MODE,
        VITE_GLOB_APP_TITLE,
        VITE_BASE_API,
        VITE_USER_NODE_ENV,
        VITE_PUBLIC_PATH
    };
}
