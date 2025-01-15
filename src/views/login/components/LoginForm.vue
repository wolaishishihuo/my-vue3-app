<template>
    <el-form ref="formRef" :model="loginForm" :rules="loginRules" size="large" class="login-form">
        <div class="login-type-switch">
            <div class="flex items-center justify-center gap-6 text-sm">
                <span
                    :class="[
                        'login-type-item cursor-pointer transition-all duration-300 relative',
                        loginForm.loginType === 'password' ? 'text-primary font-medium scale-110' : 'text-gray-400 hover:text-gray-600'
                    ]"
                    @click="switchLoginType('password')"
                >
                    账号密码登录
                </span>
                <span
                    :class="[
                        'login-type-item cursor-pointer transition-all duration-300 relative',
                        loginForm.loginType === 'email' ? 'text-primary font-medium scale-110' : 'text-gray-400 hover:text-gray-600'
                    ]"
                    @click="switchLoginType('email')"
                >
                    邮箱验证码登录
                </span>
            </div>
            <div class="relative h-0.5 mt-3">
                <div
                    class="absolute h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
                    :style="{
                        width: '30%',
                        left: loginForm.loginType === 'password' ? '18%' : '52%'
                    }"
                />
            </div>
        </div>

        <div class="form-container relative overflow-hidden">
            <transition name="form-slide" mode="out-in">
                <div v-if="loginForm.loginType === 'password'" key="account" class="form-content">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" class="animate-input" />
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password class="animate-input" />
                    </el-form-item>
                </div>
                <div v-else key="email" class="form-content">
                    <el-form-item prop="email">
                        <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" class="animate-input" />
                    </el-form-item>

                    <el-form-item prop="emailCode">
                        <div class="verify-code-container">
                            <el-input v-model="loginForm.emailCode" placeholder="请输入验证码" class="animate-input verify-code-input" />
                            <el-button :disabled="!canSendCode || isCountingDown" @click="sendVerificationCode" class="verify-code-btn" :class="{ 'is-disabled': !canSendCode || isCountingDown }">
                                {{ codeButtonText }}
                            </el-button>
                        </div>
                    </el-form-item>
                </div>
            </transition>
        </div>

        <el-button type="primary" :loading="loading" class="submit-btn animate-button" @click="login">
            {{ loginForm.loginType === 'password' ? '登录' : '验证并登录' }}
        </el-button>
    </el-form>
</template>

<script setup lang="ts">
import useLoginAndRegister from '@/views/login/hook';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { sendEmailCodeApi } from '@/api/auth';
import { useVerifycode } from '@/hooks/useVerifycode';

const { loading, loginForm, login, formRef, loginRules } = useLoginAndRegister();
const { isCountingDown, countdown, startCountdown, codeButtonText } = useVerifycode();
const { canSendCode, sendVerificationCode } = useSendEmailCode();

// 发送邮箱验证码
function useSendEmailCode() {
    const canSendCode = computed(() => {
        return loginForm.loginType === 'email' && loginForm.email && !isCountingDown.value;
    });

    const sendVerificationCode = async () => {
        try {
            const { success, message } = await sendEmailCodeApi(loginForm.email);
            if (success) {
                ElMessage.success('验证码已发送至您的邮箱');
                startCountdown();
            } else {
                ElMessage.error(message || '验证码发送失败，请稍后重试');
            }
        } catch (error) {
            ElMessage.error('验证码发送失败，请稍后重试');
        }
    };

    return {
        canSendCode,
        sendVerificationCode
    };
}

const switchLoginType = (type: 'password' | 'email') => {
    if (loginForm.loginType === type) return;
    loginForm.loginType = type;
    formRef.value?.clearValidate();
};
</script>

<style scoped lang="scss">
.login-form {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    .input-label {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--el-text-color-secondary);
        text-transform: uppercase;
    }
    .el-form-item {
        margin: 0 2px 24px;
        margin-bottom: 24px;
    }
    .el-input {
        --el-input-height: 44px;
        :deep(.el-input__wrapper) {
            padding: 0 16px;
            background-color: var(--el-fill-color-blank);
            border: 1px solid var(--el-border-color-lighter);
            border-radius: 8px;
            box-shadow: 0 0 0 0 transparent;
            transition: all 0.3s ease-in-out;
            &:hover {
                border-color: var(--el-color-primary-light-3);
            }
            &.is-focus {
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 1px var(--el-color-primary-light-5) !important;
            }
            .el-input__inner {
                font-size: 15px;
                &::placeholder {
                    color: var(--el-text-color-placeholder);
                }
            }
        }
    }
}
.login-type-switch {
    margin-bottom: 32px;
}
.login-type-item {
    position: relative;
    padding: 4px 8px;
    &::after {
        position: absolute;
        bottom: -8px;
        left: 50%;
        width: 0;
        height: 2px;
        content: '';
        background-color: var(--el-color-primary);
        opacity: 0;
        transition: all 0.3s ease-in-out;
        transform: translateX(-50%);
    }
    &:hover::after {
        width: 20px;
        opacity: 0.5;
    }
    &.text-primary::after {
        width: 30px;
        opacity: 1;
    }
}

// 表单切换动画
.form-slide-enter-active,
.form-slide-leave-active {
    transition: all 0.3s ease-in-out;
}
.form-slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}
.form-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
:deep(.el-input-group__append) {
    padding: 0;
    .el-button {
        min-width: 120px;
        height: var(--el-input-height);
        border: none;
        border-radius: 0 8px 8px 0;
        transition: all 0.3s ease-in-out;
        &:not(:disabled):hover {
            color: white;
            background-color: var(--el-color-primary-light-3);
        }
    }
}

// 确保动画流畅
.form-container {
    min-height: 180px;
    padding: 0 2px;
    margin: 0 -2px;
    overflow: visible;
    perspective: 1000px;
}
.form-content {
    backface-visibility: hidden;
    transform-style: preserve-3d;
}
.verify-code-container {
    display: flex;
    gap: 8px;
    align-items: stretch;
    width: 100%;
    margin: 0 -2px;
    .verify-code-input {
        flex: 1;
        min-width: 0;
        :deep(.el-input__wrapper) {
            height: var(--el-input-height);
        }
    }
}
.verify-code-btn {
    flex-shrink: 0;
    width: 108px;
    height: var(--el-input-height);
    padding: 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
    background-color: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    &:not(.is-disabled) {
        &:hover {
            color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary-light-3);
        }
        &:active {
            background-color: var(--el-color-primary-light-8);
        }
    }
    &.is-disabled {
        color: var(--el-text-color-placeholder);
        cursor: not-allowed;
        background-color: var(--el-fill-color-light);
        border-color: var(--el-border-color-lighter);
        opacity: 0.6;
    }
}

// 移除不再需要的样式
.verify-code-input {
    :deep(.el-input__wrapper) {
        border-radius: 8px;
    }
}
</style>
