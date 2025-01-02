<template>
    <el-dialog v-model="visible" :title="title" :width="width" :lock-scroll="false">
        <div class="p-4">
            <el-descriptions :column="1" border>
                <el-descriptions-item label="姓名">{{ data.name }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ data.age }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ data.email }}</el-descriptions-item>
            </el-descriptions>
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

interface DataModalProps extends ModalProps {
    data: {
        name: string;
        age: number;
        email: string;
    };
}

const props = withDefaults(defineProps<DataModalProps>(), {
    visible: false,
    title: '数据模态框',
    width: '500px'
});
const emit = defineEmits<ModalEmits>();

const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
});

const handleConfirm = () => emit('confirm', props.data);
const handleCancel = () => emit('cancel');
</script>
