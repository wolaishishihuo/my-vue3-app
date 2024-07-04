import { Login } from '@/api/interface';
import { loginApi, registerApi } from '@/api/login';
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
        captcha: {
            key: '',
            value: ''
        }
    });
    const registerForm = reactive({
        username: '',
        password: '',
        passwordConfirm: '',
        captcha: {
            key: '',
            value: ''
        }
    });
    const login = (formEl: FormInstance | undefined) => {
        validateAndCallApi(formEl, loginForm, loginApi);
    };

    const register = (formEl: FormInstance | undefined) => {
        validateAndCallApi(formEl, registerForm, registerApi);
    };
    const validateAndCallApi = async (formEl: FormInstance | undefined, form: any, api: any) => {
        formEl!.validate(async valid => {
            if (!valid) return;
            loading.value = true;
            try {
                const { data } = await api({ ...form });
                successCallback(data);
            } finally {
                loading.value = false;
            }
        });
    };

    const successCallback = async (data: Login.Res) => {
        userStore.setToken(data.token);
        userStore.setUserId(data.userId);
        // 添加动态路由
        await initDynamicRouter();
        // // 清空 tabs、keepAlive 数据
        // // tabsStore.setTabs([]);
        // // keepAliveStore.setKeepAliveName([]);
        // // 跳转到首页
        router.push(HOME_URL);
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
