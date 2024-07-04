<template>
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
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
        <el-form-item>
            <Captcha v-model:captcha_value="loginForm.captcha.value" v-model:captcha_key="loginForm.captcha.key" />
        </el-form-item>
    </el-form>
    <div class="login-btn">
        <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)"> 登录 </el-button>
    </div>
    <div class="login-signup">Dont have an acount yet? <el-button link type="primary">Sign Up</el-button></div>
    <div class="login-externalLinkIcons"><ExternalLinkIcons v-for="icon in externalLinkIcons" :key="icon.name" :icon-name="icon.name" :iconlink="icon.link"></ExternalLinkIcons></div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { HOME_URL } from '@/config';
import { useUserStore } from '@/stores/modules/user';
import { initDynamicRouter } from '@/routers/modules/dynamicRouter';
import { UserFilled } from '@element-plus/icons-vue';
import { login as loginApi } from '@/api/login';
import Captcha from '@/components/Captcha/index.vue';
import ExternalLinkIcons from '@/components/ExternalLinkIcons/index.vue';
import type { ElForm } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

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

const loading = ref(false);
const loginForm = reactive({
    username: 'admin',
    password: 'admin',
    captcha: {
        key: '',
        value: ''
    }
});

// login
const login = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async valid => {
        if (!valid) return;
        loading.value = true;
        try {
            // // 1.执行登录接口
            const { data } = await loginApi({ ...loginForm });
            userStore.setToken(data.token);
            // 2.添加动态路由
            await initDynamicRouter();
            // // 3.清空 tabs、keepAlive 数据
            // // tabsStore.setTabs([]);
            // // keepAliveStore.setKeepAliveName([]);
            // // 4.跳转到首页
            router.push(HOME_URL);
        } finally {
            loading.value = false;
        }
    });
};

onMounted(() => {
    // 监听 enter 事件（调用登录）
    document.onkeydown = (e: KeyboardEvent) => {
        e = (window.event as KeyboardEvent) || e;
        if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
            if (loading.value) return;
            login(loginFormRef.value);
        }
    };
});
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
