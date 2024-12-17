<template>
    <div class="dashboard-container">
        <!-- 欢迎信息 -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="welcome-card">
                    <div class="welcome-content">
                        <div class="welcome-info">
                            <h2>{{ greetingText }}，{{ userInfo?.username }}</h2>
                            <p class="subtitle">今天是{{ nowTime }}，{{ weatherInfo }}</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="user-card">
                    <div class="user-info">
                        <div class="avatar-wrapper">
                            <el-avatar :size="80" :src="userInfo?.avatar">{{ userInfo?.nickname?.charAt(0) }}</el-avatar>
                        </div>
                        <div class="info-content">
                            <h3 class="nickname">{{ userInfo?.nickname || userInfo?.username }}</h3>
                            <div class="role-tags">
                                <el-tag v-for="role in userInfo?.roles" :key="role" size="small" type="info" effect="plain" class="role-tag">
                                    {{ role }}
                                </el-tag>
                            </div>
                            <div class="contact-info">
                                <el-tag size="small" type="success" effect="light">
                                    <el-icon><Message /></el-icon>
                                    <span>{{ userInfo?.email }}</span>
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 项目动态和待办事项 -->
        <el-row :gutter="20" class="main-content">
            <el-col :span="16" class="left-column">
                <el-card class="timeline-card">
                    <template #header>
                        <div class="card-header">
                            <span class="title">项目动态</span>
                        </div>
                    </template>
                    <el-timeline>
                        <el-timeline-item
                            v-for="(activity, index) in filteredActivities"
                            :key="index"
                            :type="activity.type"
                            :color="activity.color"
                            :timestamp="activity.time"
                            :hollow="activity.hollow"
                        >
                            <div class="timeline-content">
                                <h4>{{ activity.title }}</h4>
                                <p>{{ activity.content }}</p>
                                <div class="timeline-footer">
                                    <el-tag size="small" :type="activity.tagType">{{ activity.tag }}</el-tag>
                                    <span class="operator">{{ activity.operator }}</span>
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-card>
            </el-col>
            <el-col :span="8" class="right-column">
                <el-card class="todo-card">
                    <template #header>
                        <div class="card-header">
                            <span class="title">待办事项</span>
                            <el-button type="primary" link @click="addTodo">
                                <el-icon><Plus /></el-icon>添加
                            </el-button>
                        </div>
                    </template>
                    <div class="todo-list">
                        <div v-for="(todo, index) in todos" :key="index" class="todo-item">
                            <el-checkbox v-model="todo.completed" @change="handleTodoChange(todo)">
                                <span :class="{ completed: todo.completed }">{{ todo.content }}</span>
                            </el-checkbox>
                            <div class="todo-meta">
                                <el-tag size="small" :type="todo.priority">{{ todo.priorityLabel }}</el-tag>
                                <span class="time">{{ todo.deadline }}</span>
                            </div>
                        </div>
                    </div>
                </el-card>

                <!-- 项目进度 -->
                <el-card class="progress-card">
                    <template #header>
                        <div class="card-header">
                            <span class="title">项目进度</span>
                        </div>
                    </template>
                    <div class="progress-list">
                        <div v-for="(project, index) in projects" :key="index" class="progress-item">
                            <div class="progress-info">
                                <span class="name">{{ project.name }}</span>
                                <span class="percentage">{{ project.percentage }}%</span>
                            </div>
                            <el-progress :percentage="project.percentage" :status="project.status" :stroke-width="8" />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { getTimeState } from '@/utils';
import { useTime } from '@/hooks/useTime';
import { useUserStore } from '@/stores/modules/user';

interface Activity {
    id: string;
    time: string;
    title: string;
    content: string;
    operator: string;
    type: 'success' | 'warning' | 'primary' | 'info' | 'danger';
    color: string;
    tag: string;
    tagType: 'success' | 'warning' | 'primary' | 'info' | 'danger';
    status: 'done' | 'pending';
    hollow: boolean;
}

interface TodoItem {
    id: string;
    content: string;
    completed: boolean;
    deadline: string;
    priority: 'success' | 'warning' | 'info' | 'primary' | 'danger';
    priorityLabel: string;
    createTime: string;
}

interface Project {
    id: string;
    name: string;
    percentage: number;
    status: '' | 'success' | 'exception' | 'warning';
    startTime: string;
    endTime: string;
}

// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 基础数据
const greetingText = getTimeState();
const { nowTime } = useTime();

const weatherInfo = ref('晴朗 26℃');
const timelineFilter = ref<'all' | 'pending' | 'done'>('all');

// 项目动态数据
const activities: Activity[] = [
    {
        id: crypto.randomUUID(),
        time: '2023-12-18 10:00',
        title: '发布新版本',
        content: '系统已更新至 v2.0.0 版本，新增多项功能特性',
        operator: '系统管理员',
        type: 'success',
        color: '#67C23A',
        tag: '版本发布',
        tagType: 'success',
        status: 'done',
        hollow: false
    },
    {
        id: crypto.randomUUID(),
        time: '2023-12-18 09:30',
        title: '代码审核',
        content: '完成用户管理模块代码审核，并提出优化建议',
        operator: '技术主管',
        type: 'warning',
        color: '#E6A23C',
        tag: '代码审核',
        tagType: 'warning',
        status: 'pending',
        hollow: true
    },
    {
        id: crypto.randomUUID(),
        time: '2023-12-18 09:00',
        title: '新功能开发',
        content: '开始开发数据可视化功能，预计本周完成',
        operator: '开发人员',
        type: 'primary',
        color: '#409EFF',
        tag: '功能开发',
        tagType: 'primary',
        status: 'pending',
        hollow: true
    }
];

// 待办事项数据
const todos = ref<TodoItem[]>([
    {
        id: crypto.randomUUID(),
        content: '完成首页开发',
        completed: false,
        deadline: '今天 18:00',
        priority: 'danger',
        priorityLabel: '紧急',
        createTime: new Date().toISOString()
    },
    {
        id: crypto.randomUUID(),
        content: '代码审核',
        completed: true,
        deadline: '今天 12:00',
        priority: 'warning',
        priorityLabel: '重要',
        createTime: new Date().toISOString()
    },
    {
        id: crypto.randomUUID(),
        content: '项目周报',
        completed: false,
        deadline: '明天 10:00',
        priority: 'info',
        priorityLabel: '普通',
        createTime: new Date().toISOString()
    }
]);

// 项目进度数据
const projects: Project[] = [
    {
        id: crypto.randomUUID(),
        name: '用户中心',
        percentage: 90,
        status: 'success',
        startTime: '2023-12-01',
        endTime: '2023-12-31'
    },
    {
        id: crypto.randomUUID(),
        name: '数据分析',
        percentage: 70,
        status: '',
        startTime: '2023-12-01',
        endTime: '2024-01-31'
    },
    {
        id: crypto.randomUUID(),
        name: '支付系统',
        percentage: 30,
        status: 'exception',
        startTime: '2023-12-15',
        endTime: '2024-02-28'
    }
];

// 计算属性：根据筛选条件过滤动态
const filteredActivities = computed(() => {
    if (timelineFilter.value === 'all') return activities;
    return activities.filter(activity => timelineFilter.value === activity.status);
});

// 方法：添加待办事项
const addTodo = () => {
    const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        content: '新的待办事项',
        completed: false,
        deadline: '待设置',
        priority: 'info',
        priorityLabel: '普通',
        createTime: new Date().toISOString()
    };
    todos.value.unshift(newTodo);
};

// 方法：处理待办事项状态变化
const handleTodoChange = (todo: TodoItem) => {
    const index = todos.value.findIndex(item => item.id === todo.id);
    if (index !== -1) {
        todos.value[index] = { ...todo };
        // 这里可以添加持久化存储或者发送到后端的逻辑
    }
};
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
