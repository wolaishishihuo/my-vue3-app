import { loginApi, registerApi } from '@/api/auth';
import { HOME_URL } from '@/config';
import { initDynamicRouter } from '@/routers/modules/dynamicRouter';
import { useUserStore } from '@/stores/modules/user';
import { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

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
        passwordConfirm: '',
        captchaValue: '',
        captchaKey: ''
    });
    const login = (formEl: FormInstance | undefined) => {
        validateAndCallApi(formEl, loginForm, login);
    };

    const register = (formEl: FormInstance | undefined) => {
        validateAndCallApi(formEl, registerForm, register);
    };
    const validateAndCallApi = async (formEl: FormInstance | undefined, form: any, api: any) => {
        formEl!.validate(async valid => {
            if (!valid) return;
            loading.value = true;
            try {
                // const { data } = await api({ ...form, captcha: { key: form.captchaKey, value: form.captchaValue } });
                const data = {
                    access_token: 'admin123',
                    token_type: 'Bearer',
                    expires_in: 3600
                };
                await new Promise(resolve => setTimeout(resolve, 1000)); // 添加1秒延时
                successCallback(data);
            } finally {
                loading.value = false;
            }
        });
    };

    const successCallback = async (data: Auth.LoginResult) => {
        userStore.setToken(data.access_token);
        await userStore.getUserInfo();
        // 添加动态路由
        await initDynamicRouter();
        // // 清空 tabs、keepAlive 数据
        // // tabsStore.setTabs([]);
        // // keepAliveStore.setKeepAliveName([]);
        // // 跳转到首页
        const redirect = router.currentRoute.value.query.redirect;
        if (redirect) {
            router.push(redirect as string);
        } else {
            router.push(HOME_URL);
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
        monitorEnter
    };
};
