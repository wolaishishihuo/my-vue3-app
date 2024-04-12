<template>
    <div>about</div>
    <el-button type="primary" @click="getUserList">Default</el-button>
</template>

<script setup lang="ts">
import { getUserList } from '@/api/user';
const getUser = () => {
    getUserList().then(res => {
        console.log(res);
    });
};
</script>
<style scoped lang="scss"></style>
