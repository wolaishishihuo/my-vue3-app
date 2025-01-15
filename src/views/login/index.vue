<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-left" :class="{ 'is-register': isRegister }">
                <transition name="image-fade" mode="out-in">
                    <div :key="isRegister ? 'register' : 'login'" class="left-content">
                        <div class="animated-text">
                            {{ isRegister ? 'Join\nUs' : 'Welcome\nBack' }}
                        </div>
                        <div class="animated-circles">
                            <div class="circle"></div>
                            <div class="circle"></div>
                            <div class="circle"></div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="login-content">
                <transition name="fade" mode="out-in">
                    <h2 class="welcome-title" :key="isRegister ? 'register' : 'login'">
                        {{ isRegister ? 'Create Account' : 'Welcome Back!' }}
                    </h2>
                </transition>
                <transition name="fade" mode="out-in">
                    <p class="welcome-desc" :key="isRegister ? 'register' : 'login'">
                        {{ isRegister ? 'Please fill in the form to create your account' : 'Please sign in to continue' }}
                    </p>
                </transition>

                <div class="form-container">
                    <transition name="form-fade" mode="out-in">
                        <div :key="isRegister ? 'register' : 'login'" class="form-wrapper">
                            <LoginForm v-if="!isRegister" />
                            <RegisterForm v-if="isRegister" />
                        </div>
                    </transition>
                </div>

                <div class="switch-form">
                    <template v-if="!isRegister">
                        Don't have an account?
                        <el-link type="primary" :underline="false" @click="goRegister">Sign up now</el-link>
                    </template>
                    <template v-else>
                        Already have an account?
                        <el-link type="primary" :underline="false" @click="back">Sign in</el-link>
                    </template>
                </div>
                <div class="flex justify-center gap-4"><ExternalLinkIcons v-for="icon in externalLinkIcons" :key="icon.name" :icon-name="icon.name" :iconlink="icon.link"></ExternalLinkIcons></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import useLoginAndRegister from './hook';
import ExternalLinkIcons from '@/components/ExternalLinkIcons/index.vue';
import { externalLinkIcons } from '@/config/constant';

const { isRegister, back, goRegister } = useLoginAndRegister();
</script>

<style scoped lang="scss">
@import './index';
</style>
