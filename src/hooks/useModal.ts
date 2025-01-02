import { createGlobalState } from '@vueuse/core';
import { camelCase, kebabCase, upperFirst } from 'lodash-es';
import { ref, useAttrs } from 'vue';
import type { ModalComponentType, ModalInstance, ModalEvents, ModalOptions } from '../components/Modal/interface';
import { generateUniqueId } from '@/utils';

export const useModal = createGlobalState(() => {
    const modalInstances = ref<Map<string, ModalInstance>>(new Map());
    const isLoading = ref(false);
    const attrs = useAttrs();

    // 创建模态框管理器
    const modalManager = {
        async open(component: ModalComponentType, attrs: ModalEvents & ModalOptions = {}, id = generateUniqueId()): Promise<string> {
            if (!component) {
                return 'no-component';
            }

            try {
                isLoading.value = true;
                const loadedComponent = await (typeof component === 'function' ? component() : component.component());
                // 直接调用 beforeOpen 回调
                attrs?.onBeforeOpen?.();
                modalInstances.value.set(id, {
                    id,
                    component: loadedComponent,
                    attrs,
                    visible: true
                });
                // 直接调用 afterOpen 回调
                attrs?.onAfterOpen?.();
                return id;
            } finally {
                isLoading.value = false;
            }
        },

        close(id?: string): void {
            if (id) {
                const instance = modalInstances.value.get(id);
                if (!instance) return;
                // 直接调用 beforeClose 回调
                instance.attrs?.onBeforeClose?.();
                modalInstances.value.delete(id);
                // 直接调用 afterClose 回调
                instance.attrs?.onAfterClose?.();
            } else {
                // 关闭所有模态框时，逐个触发回调
                modalInstances.value.forEach(instance => {
                    instance.attrs?.onBeforeClose?.();
                    instance.attrs?.onAfterClose?.();
                });
                modalInstances.value.clear();
            }
        },

        getInstance(id: string): ModalInstance | undefined {
            return modalInstances.value.get(id);
        }
    };

    // 属性处理器
    const attributeProcessor = {
        processEvents(component: any): Record<string, unknown> {
            const emits = component?.default?.emits;
            if (!Array.isArray(emits)) return {};

            return emits.reduce((acc, emit) => {
                // 将事件名称转换为驼峰命名
                const eventName = `on${upperFirst(camelCase(emit))}`;
                if (attrs[eventName]) {
                    acc[eventName] = attrs[eventName];
                }
                return acc;
            }, {});
        },

        processProps(component: any): Record<string, unknown> {
            const props = component?.default?.props;
            if (!props || typeof props !== 'object') return {};

            return Object.keys(props).reduce((acc, prop) => {
                // 将属性名称转换为 kebab-case 命名
                const propKey = kebabCase(prop);
                if (attrs[propKey]) {
                    acc[propKey] = attrs[propKey];
                }
                return acc;
            }, {});
        }
    };

    return {
        modalManager,
        attributeProcessor,
        isLoading,
        modalInstances
    };
});
