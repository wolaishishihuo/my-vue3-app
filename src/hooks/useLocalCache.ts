import { watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { LOCAL_CACHE_KEY, LOCAL_CACHE_EXPIRY_TIME } from '@/config';

interface CacheItem<T> {
    value: T;
    timestamp: number;
}

// 创建一个全局的storage实例
const globalStorage = useStorage<Map<string, CacheItem<any>>>(LOCAL_CACHE_KEY, new Map());

export default function useLocalCache<T>(args?: { localKey?: string; expiryTime?: number }) {
    const { expiryTime = LOCAL_CACHE_EXPIRY_TIME } = args || {};

    const setCache = (key: string, value: T) => {
        const timestamp = Date.now();
        globalStorage.value.set(key, { value, timestamp });
    };

    const getCache = (key: string): T | null => {
        const item = globalStorage.value.get(key);
        if (item) {
            if (expiryTime && Date.now() - item.timestamp > expiryTime) {
                globalStorage.value.delete(key);
                return null;
            }
            return item.value as T;
        }
        return null;
    };

    const deleteCache = (key: string) => {
        globalStorage.value.delete(key);
    };

    const clearCache = () => {
        globalStorage.value.clear();
    };

    // 监听全局缓存变化
    watch(
        globalStorage,
        newCache => {
            try {
                localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(Array.from(newCache.entries())));
            } catch (error) {
                console.error('Failed to update localStorage:', error);
            }
        },
        { deep: true }
    );

    return { setCache, getCache, deleteCache, clearCache };
}
