<template>
    <div class="about-container">
        <!-- 项目标题 -->
        <div class="project-header">
            <el-card class="header-card">
                <h1>Vue3 app</h1>
                <p class="subtitle">现代化的后台管理系统解决方案</p>
                <div class="version-tag">
                    <el-tag type="success">Version {{ version }}</el-tag>
                </div>
            </el-card>
        </div>

        <!-- 技术栈概览 -->
        <el-row :gutter="20" class="tech-overview">
            <el-col :span="8" v-for="(stack, index) in techStacks" :key="index">
                <el-card class="tech-card" :body-style="{ padding: '20px' }">
                    <div class="tech-icon">
                        <el-icon :size="40">
                            <component :is="stack.icon" />
                        </el-icon>
                    </div>
                    <h3>{{ stack.category }}</h3>
                    <div class="tech-list">
                        <div v-for="(tech, idx) in stack.items" :key="idx" class="tech-item">
                            <span class="tech-name">{{ tech.name }}</span>
                            <el-tag size="small" type="info">{{ tech.version }}</el-tag>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 项目特性 -->
        <el-card class="features-section">
            <template #header>
                <div class="card-header">
                    <h2>项目特性</h2>
                </div>
            </template>
            <el-row :gutter="20">
                <el-col :span="8" v-for="feature in features" :key="feature.title">
                    <div class="feature-item">
                        <el-icon :size="32" class="feature-icon">
                            <component :is="feature.icon" />
                        </el-icon>
                        <h3>{{ feature.title }}</h3>
                        <p>{{ feature.description }}</p>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="about">
const { pkg, lastBuildTime } = __APP_INFO__;
const { dependencies, devDependencies, version } = pkg;
// 技术栈数据
const techStacks = [
    {
        category: '核心框架',
        icon: 'Monitor',
        items: [
            { name: 'Vue', version: dependencies.vue },
            { name: 'Vue Router', version: dependencies['vue-router'] },
            { name: 'Pinia', version: dependencies.pinia },
            { name: 'TypeScript', version: devDependencies.typescript }
        ]
    },
    {
        category: 'UI 组件',
        icon: 'Connection',
        items: [
            { name: 'Element Plus', version: dependencies['element-plus'] },
            { name: 'Wang Editor', version: dependencies['@wangeditor/editor'] }
        ]
    },
    {
        category: '工具链',
        icon: 'Tools',
        items: [
            { name: 'Vite', version: devDependencies.vite },
            { name: 'ESLint', version: devDependencies.eslint },
            { name: 'Prettier', version: devDependencies.prettier }
        ]
    }
];

// 项目特性
const features = [
    {
        icon: 'Promotion',
        title: '现代化技术栈',
        description: '采用 Vue3、TypeScript、Vite 等最新技术栈，保持技术的先进性'
    },
    {
        icon: 'SetUp',
        title: '组件化开发',
        description: '基于 Element Plus，实现高度组件化的开发模式'
    },
    {
        icon: 'DataLine',
        title: '数据可视化',
        description: '集成多种图表库，支持丰富的数据可视化展示'
    },
    {
        icon: 'Lock',
        title: '权限管理',
        description: '完善的权限管理机制，支持多角色权限控制'
    },
    {
        icon: 'CopyDocument',
        title: '主题定制',
        description: '支持主题切换，可以自定义系统主题风格'
    },
    {
        icon: 'Connection',
        title: '国际化',
        description: '支持多语言切换，轻松实现国际化'
    }
];
</script>
<style scoped lang="scss">
@use './index.scss';
</style>
