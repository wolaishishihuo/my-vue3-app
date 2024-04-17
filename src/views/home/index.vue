<template>
    <div>
        home
        <el-button @click="to">Default</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const to = () => {
    router.push('/about');
};
</script>
<style scoped lang="scss"></style>
