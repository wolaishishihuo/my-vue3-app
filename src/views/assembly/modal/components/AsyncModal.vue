<template>
    <el-dialog v-model="visible" :title="title" :width="width" :lock-scroll="false">
        <div class="p-4">
            <p>这是一个异步操作示例</p>
            <p>点击确定按钮将会触发一个异步操作</p>
            <el-progress :percentage="progress" />
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" :loading="loading" @click="handleConfirm">
                    {{ loading ? '处理中...' : '确定' }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ModalProps, ModalEmits } from '@/components/Modal/interface';

const props = withDefaults(defineProps<ModalProps>(), {
    visible: false,
    title: '异步模态框',
    width: '500px'
});
const emit = defineEmits<ModalEmits>();

const loading = ref(false);
const progress = ref(0);

const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
});

const handleConfirm = async () => {
    loading.value = true;
    try {
        // 模拟进度
        const interval = setInterval(() => {
            progress.value += 10;
            if (progress.value >= 100) {
                clearInterval(interval);
                emit('confirm');
            }
        }, 200);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => emit('cancel');
</script>
