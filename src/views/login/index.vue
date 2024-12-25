<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-left">
                <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
            </div>
            <div class="login-form">
                <div class="login-logo">
                    <h2 class="logo-text">Get's started</h2>
                </div>
                <LoginForm v-if="!isRegister" />
                <template v-if="isRegister">
                    <el-button class="login-back" @click="back" :icon="Back" link />
                    <RegisterForm />
                </template>
                <div class="login-signup" v-if="!isRegister">Dont have an acount yet? <el-button @click="goRegister" link type="primary">Sign Up</el-button></div>
                <div class="login-externalLinkIcons"><ExternalLinkIcons v-for="icon in externalLinkIcons" :key="icon.name" :icon-name="icon.name" :iconlink="icon.link"></ExternalLinkIcons></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="login">
import { ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import ExternalLinkIcons from '@/components/ExternalLinkIcons/index.vue';
import { Back } from '@element-plus/icons-vue';
const externalLinkIcons = [
    {
        name: 'github',
        link: 'https://github.com/wolaishishihuo'
    },
    {
        name: 'vue',
        link: 'https://cn.vuejs.org/'
    }
];

const isRegister = ref(false);
const back = () => (isRegister.value = false);
const goRegister = () => {
    isRegister.value = true;
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
