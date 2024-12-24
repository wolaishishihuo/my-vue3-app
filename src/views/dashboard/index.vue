<template>
    <div class="dashboard-container">
        <!-- 欢迎信息 -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="welcome-card">
                    <div class="welcome-content">
                        <div class="welcome-info">
                            <h2>{{ greetingText }}，{{ userStore.userInfo?.username }}</h2>
                            <p class="subtitle">今天是{{ nowTime }}，太原天气{{ weatherInfo.feelsLike }}°C，{{ weatherInfo.text }}</p>
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
            <el-col :span="16">
                <!-- GitHub 提交记录卡片 -->
                <el-card class="timeline-card">
                    <template #header>
                        <div class="card-header">
                            <span class="title">最近更新</span>
                            <div class="header-right">
                                <el-button v-if="!commitsLoading" :icon="Refresh" circle @click="fetchCommits()" />
                                <el-button v-else circle loading />
                            </div>
                        </div>
                    </template>

                    <el-timeline v-if="!commitsError && commits.length > 0">
                        <el-timeline-item v-for="commit in commits" :key="commit.sha" :timestamp="formatDate(commit.commit.author.date)" :type="getCommitType(commit.commit.message)">
                            <div class="timeline-content">
                                <h4>
                                    <el-link :href="commit.html_url" target="_blank" type="primary">
                                        {{ formatCommitMessage(commit.commit.message) }}
                                    </el-link>
                                </h4>
                                <div class="timeline-footer">
                                    <span class="operator">
                                        <el-tag size="small" effect="plain">
                                            {{ commit.commit.author.name }}
                                        </el-tag>
                                    </span>
                                    <span class="commit-sha">
                                        <el-tag size="small" type="info">
                                            {{ commit.sha.substring(0, 7) }}
                                        </el-tag>
                                    </span>
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>

                    <el-empty v-else-if="!commitsLoading && !commitsError && commits.length === 0" description="暂无提交记录" />

                    <el-alert v-else-if="commitsError" :title="commitsError" type="error" show-icon />
                </el-card>
            </el-col>
            <el-col :span="8" class="right-column">
                <el-card class="todo-card">
                    <template #header>
                        <div class="card-header">
                            <span class="title">待办事项</span>
                            <el-button v-permission="['todo:add', 'todo:edit']" type="primary" link @click="addTodo">
                                <el-icon><Plus /></el-icon>添加
                            </el-button>
                        </div>
                    </template>
                    <div class="todo-list">
                        <div v-for="(todo, index) in todos" :key="index" class="todo-item">
                            <div class="todo-content">
                                <el-checkbox v-model="todo.completed" @change="handleTodoChange(todo)" :disabled="!hasPermission('todo:edit')">
                                    <span :class="{ completed: todo.completed }">{{ todo.content }}</span>
                                </el-checkbox>
                                <div class="todo-actions">
                                    <el-button v-permission="['todo:delete', 'todo:edit']" type="danger" link @click="confirmDelete(todo)">
                                        <el-icon><Delete /></el-icon>
                                    </el-button>
                                </div>
                            </div>
                            <div class="todo-meta">
                                <el-tag size="small" :type="todo.priority">{{ todo.priorityLabel }}</el-tag>
                                <span class="time">{{ todo.deadline }}</span>
                            </div>
                        </div>
                        <div v-if="todos.length === 0" class="empty-text">暂无待办事项</div>
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

<script setup lang="ts" name="dashboard">
import { ref, computed } from 'vue';
import { Plus, Delete, Refresh, Message, UserFilled } from '@element-plus/icons-vue';
import { getTimeState } from '@/utils';
import { formatDate } from '@/utils/time';
import { useTime } from '@/hooks/useTime';
import { useUserStore } from '@/stores/modules/user';
import { useAuthStore } from '@/stores/modules/auth';
import { TodoItem, Project } from './interface';
import { useWeather } from '@/hooks/useWeather';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useGithubCommits } from '@/hooks/useGithubCommits';
import { GITHUB_OWNER, GITHUB_REPO } from '@/config';

// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 时间
const greetingText = getTimeState();
const { nowTime } = useTime();

// 天气信息
const { weatherInfo } = useWeather('太原');

// 待办事项数据
const todos = ref<TodoItem[]>([
    {
        id: crypto.randomUUID(),
        content: '完成首页开发',
        completed: true,
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
        status: 'warning',
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

// 方法：添加待办事项
const addTodo = () => {
    if (!hasPermission('todo:add')) {
        ElMessage.warning('您没有添加待办事项的权限');
        return;
    }
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
    ElMessage.success('添加成功');
};

// 方法：处理待办事项状态变化
const handleTodoChange = (todo: TodoItem) => {
    if (!hasPermission('todo:edit')) {
        ElMessage.warning('您没有编辑待办事项的权限');
        return;
    }
    const index = todos.value.findIndex(item => item.id === todo.id);
    if (index !== -1) {
        todos.value[index] = { ...todo };
        ElMessage.success(todo.completed ? '已完成' : '已取消完成');
    }
};

// 确认删除对话框
const confirmDelete = (todo: TodoItem) => {
    ElMessageBox.confirm(`确定要删除待办事项 "${todo.content}" 吗？`, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            deleteTodo(todo);
        })
        .catch(() => {
            // 用户取消删除
        });
};

// 删除待办事项
const deleteTodo = (todo: TodoItem) => {
    const index = todos.value.findIndex(item => item.id === todo.id);
    if (index !== -1) {
        todos.value.splice(index, 1);
        ElMessage.success('删除成功');
    }
};

// 权限控制
const authStore = useAuthStore();
const hasPermission = (permission: string | string[]) => {
    if (Array.isArray(permission)) {
        return permission.some(p => authStore.hasButtonPermission(p));
    }
    return authStore.hasButtonPermission(permission);
};

// GitHub 提交记录
const { commits, loading: commitsLoading, error: commitsError, fetchCommits, getCommitType, formatCommitMessage } = useGithubCommits(GITHUB_OWNER, GITHUB_REPO);

// 获取角色对应的标签类型
const getRoleType = (role?: string): 'danger' | 'success' | 'warning' | 'info' | 'primary' => {
    if (!role) return 'info';

    const roleTypes: Record<string, 'danger' | 'success' | 'warning' | 'info' | 'primary'> = {
        admin: 'danger',
        editor: 'warning',
        user: 'info'
    };
    return roleTypes[role.toLowerCase()] || 'info';
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
