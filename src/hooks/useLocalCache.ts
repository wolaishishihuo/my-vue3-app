import { watch } from 'vue';
import { useStorage } from '@vueuse/core';

interface CacheItem<T> {
    value: T;
    timestamp: number;
}

export const useLocalCache = <T>(localKey: string, expiryTime?: number) => {
    const storage = useStorage<Map<string, CacheItem<T>>>(localKey, new Map());

    const setCache = (key: string, value: T) => {
        const timestamp = Date.now();
        storage.value.set(key, { value, timestamp });
    };

    const getCache = (key: string): T | null => {
        const item = storage.value.get(key);
        if (item) {
            if (expiryTime && Date.now() - item.timestamp > expiryTime) {
                storage.value.delete(key);
                return null;
            }
            return item.value;
        }
        return null;
    };

    const deleteCache = (key: string) => {
        storage.value.delete(key);
    };

    const clearCache = () => {
        storage.value.clear();
    };

    // 监听缓存变化并更新 localStorage
    watch(
        storage,
        newCache => {
            try {
                localStorage.setItem(localKey, JSON.stringify(Array.from(newCache.entries())));
            } catch (error) {
                console.error('Failed to update localStorage:', error);
            }
        },
        { deep: true }
    );

    return { setCache, getCache, deleteCache, clearCache };
};
