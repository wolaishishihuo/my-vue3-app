import { watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { LOCAL_CACHE_KEY, LOCAL_CACHE_EXPIRY_TIME } from '@/config';

interface CacheItem<T> {
    value: T;
    timestamp: number;
}

// 创建一个全局的storage实例
const globalStorage = useStorage<Map<string, CacheItem<any>>>(LOCAL_CACHE_KEY, new Map());

export default function useLocalCache<T>(args?: { expiryTime?: number }) {
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

    const clearCache = (excludeKeys: string[] = []) => {
        if (excludeKeys.length === 0) {
            globalStorage.value.clear();
            return;
        }
        const entries = Array.from(globalStorage.value.entries());
        globalStorage.value.clear();
        // 重新设置需要保留的缓存项
        entries.forEach(([key, value]) => {
            if (excludeKeys.includes(key)) {
                globalStorage.value.set(key, value);
            }
        });
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
