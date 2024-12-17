<template>
    <el-main>
        <router-view v-slot="{ Component, route }">
            <transition appear name="fade-transform" mode="out-in">
                <keep-alive>
                    <component class="card" :is="createComponentWrapper(Component, route)" v-if="isRouterShow" :key="route.fullPath" />
                </keep-alive>
            </transition>
        </router-view>
    </el-main>
</template>

<script setup lang="ts">
import { ref, provide, h } from 'vue';

// 注入刷新页面方法
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide('refresh', refreshCurrentPage);

// 解决详情页 keep-alive 问题
const wrapperMap = new Map();
function createComponentWrapper(component, route) {
    if (!component) return;
    const wrapperName = route.fullPath;
    let wrapper = wrapperMap.get(wrapperName);
    if (!wrapper) {
        wrapper = { name: wrapperName, render: () => h(component) };
        wrapperMap.set(wrapperName, wrapper);
    }
    return h(wrapper);
}
</script>

<style scoped lang="scss"></style>
