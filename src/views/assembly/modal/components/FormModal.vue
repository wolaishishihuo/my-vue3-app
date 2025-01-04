<template>
    <el-dialog v-model="visible" :lock-scroll="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="p-4">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="0" :max="120" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { ModalProps, ModalEmits } from '@/components/Modal/interface';

interface FormData {
    name: string;
    email: string;
    age: number | undefined;
}

interface FormModalProps extends ModalProps {
    formData: FormData;
}

const props = withDefaults(defineProps<FormModalProps>(), {
    visible: false,
    title: '表单模态框',
    width: '500px'
});
const emit = defineEmits<ModalEmits>();

const formRef = ref<FormInstance>();
const form = ref<FormData>({ ...props.formData });

const rules: FormRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
};

const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
});

const handleConfirm = async () => {
    if (!formRef.value) return;
    try {
        await formRef.value.validate();
        emit('confirm', form.value);
    } catch (error) {
        console.log(error);
    }
};

const handleCancel = () => emit('cancel');
</script>
