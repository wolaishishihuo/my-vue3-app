import { createGlobalState } from '@vueuse/core';
import { camelCase, kebabCase, upperFirst } from 'lodash-es';
import { ref, useAttrs } from 'vue';
import type { ModalComponentType, ModalInstance, ModalEvents, ModalOptions } from '../components/Modal/interface';
import { generateUniqueId } from '@/utils';

// 使用 Symbol 作为事件名称，避免命名冲突
const MODAL_EVENTS = {
    BEFORE_OPEN: Symbol('before-open'),
    AFTER_OPEN: Symbol('after-open'),
    BEFORE_CLOSE: Symbol('before-close'),
    AFTER_CLOSE: Symbol('after-close')
};

export const useModal = createGlobalState(() => {
    // 使用 Map 存储多个模态框实例
    const modalInstances = ref(new Map<string, ModalInstance>());
    const isLoading = ref(false);
    const attrs = useAttrs();

    // 创建模态框管理器
    const modalManager = {
        // 打开模态框
        async open(component: ModalComponentType, attrs: ModalEvents & ModalOptions = {}, id = generateUniqueId()) {
            if (!component) {
                throw new Error('Modal component is required');
            }
            try {
                isLoading.value = true;

                // 触发打开前事件
                window.dispatchEvent(new CustomEvent(MODAL_EVENTS.BEFORE_OPEN.toString()));
                const loadedComponent = await (typeof component === 'function' ? component() : component.component());
                modalInstances.value.set(id, {
                    id,
                    component: loadedComponent,
                    attrs,
                    visible: true
                });

                // 触发打开后事件
                window.dispatchEvent(new CustomEvent(MODAL_EVENTS.AFTER_OPEN.toString()));

                return id;
            } catch (error) {
                console.error('Failed to load modal component:', error);
                throw new Error('Modal component loading failed');
            } finally {
                isLoading.value = false;
            }
        },

        // 关闭模态框
        close(id?: string) {
            if (id) {
                const instance = modalInstances.value.get(id);
                if (instance) {
                    // 触发关闭前事件
                    window.dispatchEvent(new CustomEvent(MODAL_EVENTS.BEFORE_CLOSE.toString()));

                    const { attrs } = instance;
                    if (attrs.onClose) {
                        attrs.onClose();
                    }
                    modalInstances.value.delete(id);
                    // 触发关闭后事件
                    window.dispatchEvent(new CustomEvent(MODAL_EVENTS.AFTER_CLOSE.toString()));
                }
            } else {
                // 关闭所有模态框
                modalInstances.value.clear();
                // 触发关闭后事件
                window.dispatchEvent(new CustomEvent(MODAL_EVENTS.AFTER_CLOSE.toString()));
            }
        },

        // 获取模态框实例
        getInstance(id: string) {
            return modalInstances.value.get(id);
        }
    };

    // 属性处理器
    const attributeProcessor = {
        // 处理组件事件
        processEvents(component: any) {
            if (!component?.default?.emits) return {};
            const newAttrs = {};
            component?.default?.emits?.forEach(emit => {
                const eventName = 'on' + upperFirst(camelCase(emit));
                if (attrs[eventName]) {
                    newAttrs[eventName] = attrs[eventName];
                }
            });
            return newAttrs;
        },

        // 处理组件属性
        processProps(component: any) {
            if (!component?.default?.props) return {};
            const newAttrs = {};
            for (const prop in component?.default?.props) {
                const propKey = kebabCase(prop);
                if (attrs[propKey]) {
                    newAttrs[propKey] = attrs[propKey];
                }
            }

            return newAttrs;
        }
    };

    return {
        modalManager,
        attributeProcessor,
        isLoading,
        modalInstances,
        MODAL_EVENTS
    };
});
