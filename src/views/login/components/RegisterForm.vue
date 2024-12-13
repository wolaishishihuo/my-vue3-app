<template>
    <el-form ref="registerFormRef" :model="registerForm" :rules="loginRules" size="large">
        <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <user />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <lock />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="passwordConfirm">
            <el-input v-model="registerForm.passwordConfirm" type="password" placeholder="请输入确认密码" show-password autocomplete="new-password">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <lock />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="captchaValue">
            <Captcha v-model:captcha_value="registerForm.captchaValue" v-model:captcha_key="registerForm.captchaKey" />
        </el-form-item>
    </el-form>
    <div class="login-btn">
        <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="register(registerFormRef)"> 注册 </el-button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import Captcha from '@/components/Captcha/index.vue';
import type { ElForm } from 'element-plus';
import useLoginAndRegister from '@/views/login/hook';

type FormInstance = InstanceType<typeof ElForm>;
const registerFormRef = ref<FormInstance>();
const loginRules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        }
    ],
    passwordConfirm: [
        {
            required: true,
            validator: (_: any, value: any, callback: any) => {
                if (value) {
                    if (value != registerForm.password) {
                        callback(new Error('俩次密码不一致'));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error('请输入确认密码'));
                }
            },
            trigger: ['change', 'blur']
        }
    ],
    captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});
const { loading, registerForm, register, monitorEnter } = useLoginAndRegister();

onMounted(() => {
    // 监听 enter 事件（调用注册）
    monitorEnter(() => {
        register(registerFormRef.value);
    });
});
</script>

<style scoped lang="scss">
@use '../index.scss';
</style>
