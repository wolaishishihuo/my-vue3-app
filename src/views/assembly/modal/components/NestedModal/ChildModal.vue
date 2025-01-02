<template>
    <el-dialog v-model="visible" :title="title" :width="width" :lock-scroll="false" append-to-body>
        <div class="p-4">
            <p>这是子模态框</p>
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

const props = withDefaults(defineProps<ModalProps>(), {
    visible: false,
    title: '子模态框',
    width: '500px'
});
const emit = defineEmits<ModalEmits>();

const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
});

const handleConfirm = () => emit('confirm');
const handleCancel = () => emit('cancel');
</script>
