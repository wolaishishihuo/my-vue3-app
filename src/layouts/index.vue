<template>
    <el-container class="layout">
        <el-header>
            <div class="header-lf mask-image">
                <div class="logo flx-center">
                    <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
                    <!-- <span class="logo-text">{{ title }}</span> -->
                </div>
                <!-- <ToolBarLeft /> -->
            </div>
            <div class="header-ri">
                <!-- <ToolBarRight /> -->
            </div>
        </el-header>
        <el-container class="classic-content">
            <!-- :style="{ width: isCollapse ? '65px' : '210px' }" -->
            <el-aside>
                <div class="aside-box">
                    <el-scrollbar>
                        <!-- <el-menu :router="false" :default-active="activeMenu" :collapse="isCollapse" :unique-opened="accordion" :collapse-transition="false">
                                <SubMenu :menu-list="menuList" />
                            </el-menu> -->
                    </el-scrollbar>
                </div>
            </el-aside>
            <el-container class="classic-main">
                <!-- <Main /> -->
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
@import './index.scss';
.layout {
    min-width: 600px;
}
</style>
