<template>
    <el-dialog v-model="visible" :title="title" :width="width" :lock-scroll="false">
        <div class="p-4">
            <p>这是父模态框</p>
            <el-button @click="openChild">打开子模态框</el-button>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ModalProps, ModalEmits } from '@/components/Modal/interface';

interface ParentModalProps extends ModalProps {
    openChildModal: () => Promise<void>;
}

const props = withDefaults(defineProps<ParentModalProps>(), {
    visible: false,
    title: '父模态框',
    width: '500px'
});
const emit = defineEmits<ModalEmits>();

const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
});

const openChild = () => props.openChildModal();
const handleConfirm = () => emit('confirm');
const handleCancel = () => emit('cancel');
</script>
