<template>
    <div class="header-lf">
        <SvgIcon class="logo" @click="goHome" name="logo" :icon-style="{ width: '100px', height: '50px' }" />
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => {
    router.replace('/');
};
</script>
<style scoped lang="scss"></style>
