<template>
    <div class="flex flex-col items-center p-6">
        <el-card class="profile-card w-full p-6 bg-white rounded-lg shadow-md">
            <div class="flex items-center mb-4">
                <el-avatar :src="avatarUrl" size="large" class="mr-4 transition-transform transform hover:scale-105"></el-avatar>
                <div class="flex-1">
                    <h2 class="text-xl font-semibold text-gray-800">{{ userName }}</h2>
                    <p class="text-gray-600">{{ userEmail }}</p>
                </div>
            </div>
            <el-divider></el-divider>
            <el-form label-position="top" class="profile-form mt-4">
                <el-form-item label="姓名">
                    <el-input v-model="userName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="userEmail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex justify-end mt-4">
                <el-button type="success" class="mr-2">保存</el-button>
                <el-button type="danger">注销</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();
const avatarUrl = computed(() => userStore.userInfo?.avatar);
const userName = ref(userStore.userInfo?.username || '张三');
const userEmail = ref(userStore.userInfo?.email || 'zhangsan@example.com');
</script>

<style scoped lang="scss"></style>
