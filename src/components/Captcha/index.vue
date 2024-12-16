<template>
    <div class="captcha">
        <el-input class="captcha_input" v-model="captchaValue" placeholder="请输入验证码" />
        <!-- <el-image :src="captcha?.svg" fit="cover" /> -->
        <div class="captcha_svg" v-html="captcha?.captchaImage" @click="getCaptchaApi"></div>
    </div>
</template>

<script setup lang="ts">
import { getCaptchaApi } from '@/api/auth';
import { ref, watch } from 'vue';
interface EmitsType {
    (e: 'update:captcha_value', value: String): void;
    (e: 'update:captcha_key', value: String): void;
}
const emit = defineEmits<EmitsType>();

const captchaValue = ref('');
const captcha = ref<Auth.GetCaptchaResult>();
const getCaptcha = async () => {
    const { data } = await getCaptchaApi();
    captcha.value = data;
};
getCaptcha();

watch(
    () => captchaValue.value,
    () => {
        emit('update:captcha_key', captcha.value!.captchaKey);
        emit('update:captcha_value', captchaValue.value);
    }
);
</script>
<style scoped lang="scss">
@use './index.scss';
</style>
