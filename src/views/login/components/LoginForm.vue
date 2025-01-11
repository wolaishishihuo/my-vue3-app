<template>
    <el-form ref="formRef" :model="loginForm" :rules="loginRules" size="large">
        <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名：admin">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <user />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码：admin" show-password autocomplete="new-password">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <lock />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="captchaValue">
            <!-- <Captcha v-model:captcha_value="loginForm.captchaValue" v-model:captcha_key="loginForm.captchaKey" /> -->
        </el-form-item>
    </el-form>
    <div class="login-btn">
        <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login"> 登录 </el-button>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import type { ElForm, FormRules } from 'element-plus';
import useLoginAndRegister from '@/views/login/hook';

const loginRules: FormRules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    // captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});

const { loading, loginForm, login, monitorEnter, formRef } = useLoginAndRegister();

onMounted(() => {
    // 监听 enter 事件（调用登录）
    monitorEnter(() => {
        login();
    });
});
</script>

<style scoped lang="scss">
@import '../index';
</style>
