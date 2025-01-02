<template>
    <div class="container">
        <el-space wrap>
            <el-button @click="openBasicModal">基础模态框</el-button>
            <el-button @click="openDataModal">数据模态框</el-button>
            <el-button @click="openFormModal">表单模态框</el-button>
            <el-button @click="openAsyncModal">异步模态框</el-button>
            <el-button @click="openNestedModal">嵌套模态框</el-button>
        </el-space>
    </div>
</template>

<script setup lang="ts">
import { useModal } from '@/hooks/useModal';
import { ElMessage } from 'element-plus';

const { modalManager } = useModal();

// 基础模态框
const openBasicModal = async () => {
    const modalId = await modalManager.open(() => import('./components/BasicModal.vue'), {
        title: '基础模态框1',
        width: '500px',
        lockScroll: false,
        onConfirm: () => {
            console.log('确认');
            modalManager.close(modalId);
        },
        onCancel: () => {
            console.log('取消');
            modalManager.close(modalId);
        },
        onClose: () => {
            console.log('关闭');
        }
    });
};

// 数据模态框
const openDataModal = async () => {
    const data = {
        name: '张三',
        age: 25,
        email: 'zhangsan@example.com'
    };

    const modalId = await modalManager.open(() => import('./components/DataModal.vue'), {
        data,
        onConfirm: updatedData => {
            console.log('更新的数据:', updatedData);
            modalManager.close(modalId);
        }
    });
};

// 表单模态框
const openFormModal = async () => {
    const modalId = await modalManager.open(() => import('./components/FormModal.vue'), {
        formData: { name: '', email: '', age: 0 },
        onConfirm: async formData => {
            try {
                console.log('提交的表单数据:', formData);
                await new Promise(resolve => setTimeout(resolve, 1000));
                ElMessage.success('提交成功');
                modalManager.close(modalId);
            } catch (error) {
                ElMessage.error('提交失败');
            }
        }
    });
};

// 异步模态框
const openAsyncModal = async () => {
    const modalId = await modalManager.open(() => import('./components/AsyncModal.vue'), {
        onConfirm: async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                ElMessage.success('操作成功');
                modalManager.close(modalId);
            } catch (error) {
                ElMessage.error('操作失败');
            }
        }
    });
};

// 嵌套模态框
const openNestedModal = async () => {
    const parentModalId = await modalManager.open(() => import('./components/NestedModal/ParentModal.vue'), {
        title: '父模态框',
        width: '500px',
        openChildModal: async () => {
            const childModalId = await modalManager.open(() => import('./components/NestedModal/ChildModal.vue'), {
                title: '子模态框',
                width: '400px',
                appendToBody: true,
                onConfirm: () => modalManager.close(childModalId)
            });
        },
        onConfirm: () => modalManager.close(parentModalId)
    });
};
</script>
