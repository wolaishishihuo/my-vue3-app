<template>
    <div class="captcha">
        <el-input class="captcha_input" v-model="captchaValue" placeholder="请输入验证码" />
        <!-- <el-image :src="captcha?.svg" fit="cover" /> -->
        <div class="captcha_svg" v-html="captcha?.svg" @click="getCaptchaApi"></div>
    </div>
</template>

<script setup lang="ts">
import { getCaptcha } from '@/api/login';
import { ref, watch } from 'vue';
interface EmitsType {
    (e: 'update:captcha_value', value: String): void;
    (e: 'update:captcha_key', value: String): void;
}
const emit = defineEmits<EmitsType>();
interface Captcha {
    key: string;
    svg: string;
    text: string;
}
const captchaValue = ref('');
const captcha = ref<Captcha>();
const getCaptchaApi = async () => {
    const { data } = await getCaptcha();
    captcha.value = data;
};
getCaptchaApi();

watch(
    () => captchaValue.value,
    () => {
        emit('update:captcha_key', captcha.value!.key);
        emit('update:captcha_value', captchaValue.value);
    }
);
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
