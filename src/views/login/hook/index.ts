import { loginApi, registerApi } from '@/api/auth';
import { HOME_URL } from '@/config';
import { initDynamicRouter } from '@/routers/modules/dynamicRouter';
import { useUserStore } from '@/stores/modules/user';
import { ElForm, ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
type FormInstance = InstanceType<typeof ElForm>;

export default () => {
    const router = useRouter();
    const userStore = useUserStore();
    const loading = ref(false);
    const loginForm = reactive({
        username: 'admin',
        password: 'admin',
        captchaValue: '',
        captchaKey: ''
    });
    const registerForm = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        code: ''
    });
    const formRef = ref<FormInstance | null>(null);

    const formValidate = async () => {
        loading.value = true;
        return await formRef.value?.validate();
    };

    const login = async () => {
        await formValidate();
        try {
            const { data, success, message } = await loginApi(loginForm);
            if (success) {
                userStore.setAccessToken(data.access_token);
                userStore.setRefreshToken(data.refresh_token);
                await userStore.getUserInfo();
                // 添加动态路由
                await initDynamicRouter();
                // 清空 tabs、keepAlive 数据
                // tabsStore.setTabs([]);
                // keepAliveStore.setKeepAliveName([]);
                // 跳转到首页
                const redirect = router.currentRoute.value.query.redirect;
                if (redirect) {
                    router.push(redirect as string);
                } else {
                    router.push(HOME_URL);
                }
                ElMessage.success('登录成功');
            } else {
                ElMessage.error(message);
            }
        } finally {
            loading.value = false;
        }
    };

    const register = async () => {
        await formValidate();
        try {
            const { data } = await registerApi(registerForm);
        } finally {
            loading.value = false;
        }
    };

    const monitorEnter = (cb: () => void) => {
        document.onkeydown = (e: KeyboardEvent) => {
            e = (window.event as KeyboardEvent) || e;
            if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
                if (loading.value) return;
                cb && cb();
            }
        };
    };
    return {
        register,
        login,
        loading,
        registerForm,
        loginForm,
        monitorEnter,
        formRef
    };
};
