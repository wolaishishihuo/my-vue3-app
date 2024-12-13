<template>
    <el-container class="layout">
        <el-header>
            <div class="header-lf mask-image">
                <div class="logo flx-center">
                    <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
                    <span class="logo-text">{{ title }}</span>
                </div>
            </div>
            <div class="header-ri">
                <HeaderRight />
            </div>
        </el-header>
        <el-container class="classic-content">
            <el-aside>
                <div class="aside-box" :style="{ width: '210px' }">
                    <el-scrollbar>
                        <el-menu :router="false" :default-active="activeMenu" :unique-opened="true" :collapse-transition="false">
                            <SubMenu :menu-list="menuList" />
                        </el-menu>
                    </el-scrollbar>
                </div>
            </el-aside>
            <el-container class="classic-main">
                <Main />
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import HeaderRight from './components/Header/HeaderRight.vue';
import SubMenu from '@/layouts/components/SubMenu/index.vue';
import Main from '@/layouts/components/Main/index.vue';
import { useUserStore } from '@/stores/modules/user';

const title = import.meta.env.VITE_GLOB_APP_TITLE;
const user = useUserStore();
// user.getUserInfo();
const route = useRoute();
const authStore = useAuthStore();
const menuList = computed(() => authStore.authMenuList);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>
<style scoped lang="scss">
@use './index.scss';
</style>
