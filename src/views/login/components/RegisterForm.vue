<template>
    <el-form ref="formRef" :model="registerForm" :rules="loginRules" size="large">
        <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" autocomplete="off">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <user />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱" autocomplete="off">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <Message />
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
        <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请输入确认密码" show-password autocomplete="new-password">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <lock />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <!-- <el-form-item prop="captchaValue">
            <Captcha v-model:captcha_value="registerForm.captchaValue" v-model:captcha_key="registerForm.captchaKey" />
        </el-form-item> -->
    </el-form>
    <div class="login-btn">
        <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="register()"> 注册 </el-button>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import Captcha from '@/components/Captcha/index.vue';
import type { ElForm, FormRules } from 'element-plus';
import useLoginAndRegister from '@/views/login/hook';
import { checkEmail } from '@/utils/validate';

const loginRules: FormRules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    email: [
        {
            required: true,
            validator: checkEmail,
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        }
    ],
    confirmPassword: [
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
    ]
    // captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});
const { loading, registerForm, register, monitorEnter, formRef } = useLoginAndRegister();

onMounted(() => {
    // 监听 enter 事件（调用注册）
    monitorEnter(() => {
        register();
    });
});
</script>

<style scoped lang="scss">
@import '../index';
</style>
