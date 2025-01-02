// 基础配置接口
export interface BaseModalProps {
    visible?: boolean;
    [key: string]: any;
}

// 模态框配置选项
export interface ModalOptions extends BaseModalProps {
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
}

// 模态框事件处理
export interface ModalEvents {
    onConfirm?: (args?: any) => void | Promise<void>;
    onCancel?: (args?: any) => void;
    onClose?: (args?: any) => void;
}

// 模态框组件配置
export interface ModalComponent {
    component: () => Promise<any>;
    options?: ModalOptions;
}

// 模态框实例
export interface ModalInstance {
    id: string;
    component: any;
    attrs: Record<string, any>;
    visible: boolean;
}

// 模态框属性
export interface ModalProps extends BaseModalProps {}

// 模态框事件
export interface ModalEmits {
    (e: 'update:visible', value: boolean): void;
    (e: 'confirm', data?: any): void;
    (e: 'cancel'): void;
    (e: 'close'): void;
}

export type ModalComponentType = (() => Promise<any>) | ModalComponent;
