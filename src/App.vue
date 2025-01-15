<template>
    <router-view />
    <Dialog />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/modules/user';
import Dialog from '@/components/Modal/index.vue';

const userStore = useUserStore();

onMounted(async () => {
    // 初始化用户状态和路由
    await userStore.initState();
});
</script>
