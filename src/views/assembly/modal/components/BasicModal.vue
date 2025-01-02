<template>
    <el-dialog v-model="visible" v-bind="$attrs">
        <div class="p-4">
            <p>这是一个基础模态框示例</p>
            <p>用于展示最基本的模态框功能</p>
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

const props = defineProps<ModalProps>();
const emit = defineEmits<ModalEmits>();

const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value ?? false)
});

const handleConfirm = () => emit('confirm');
const handleCancel = () => emit('cancel');
</script>
