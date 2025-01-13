import { loginApi, registerApi } from '@/api/auth';
import { HOME_URL } from '@/config';
import useEnv from '@/hooks/useEnv';
import { initDynamicRouter } from '@/routers/modules/dynamicRouter';
import { useUserStore } from '@/stores/modules/user';
import { ElForm, ElMessage } from 'element-plus';
import { nextTick, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
type FormInstance = InstanceType<typeof ElForm>;
// 切换登录和注册
const isRegister = ref(false);
const back = () => {
    nextTick(() => {
        isRegister.value = false;
    });
    console.log(isRegister.value);
};
const goRegister = () => {
    isRegister.value = true;
};
export default () => {
    const router = useRouter();
    const userStore = useUserStore();
    const loading = ref(false);
    const env = useEnv();

    const loginForm = reactive({
        username: env.VITE_LOGIN_USERNAME!,
        password: env.VITE_LOGIN_PASSWORD!,
        captchaValue: '',
        captchaKey: ''
    });
    const registerForm = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        nickname: ''
    });
    const formRef = ref<FormInstance | null>(null);

    const formValidate = async () => {
        return await formRef.value?.validate();
    };

    const login = async () => {
        await formValidate();
        loading.value = true;
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
        loading.value = true;
        try {
            const { success, message } = await registerApi(registerForm);
            if (success) {
                ElMessage.success('注册成功, 请前往登录!');
                back();
            } else {
                ElMessage.error(message);
            }
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
        formRef,
        isRegister,
        back,
        goRegister
    };
};
