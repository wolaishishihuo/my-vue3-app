<template>
    <div class="dashboard-container">
        <!-- 欢迎信息 -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="welcome-card">
                    <div class="welcome-content">
                        <div class="welcome-info">
                            <h2>{{ greetingText }}，{{ userStore.userInfo?.username }}</h2>
                            <p class="subtitle">
                                今天是:<span class="highlight">{{ ` ${nowTime}, ` }}</span> 当前所在地: <span class="highlight">{{ `${weatherInfo?.province} ${weatherInfo?.city}, ` }}</span> 天气:
                                <span class="highlight">{{ `${weatherInfo?.weather}, ` }}</span> 温度: <span class="highlight">{{ `${weatherInfo?.temperature}°C, ` }}</span> 风力:
                                <span class="highlight">{{ `${weatherInfo?.windpower}级, ` }}</span> 湿度: <span class="highlight">{{ `${weatherInfo?.humidity}, ` }}</span> 风向:
                                <span class="highlight">{{ `${weatherInfo?.winddirection} ` }}</span>
                            </p>
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
                                <el-tag v-for="role in userInfo?.roles" :key="role.id" size="small" type="info" effect="plain" class="role-tag">
                                    {{ role.description }}
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

                    <div class="flex items-center gap-2 mb-4">
                        <el-check-tag :checked="frontChecked" type="primary" @change="toggleFront"> 前端提交记录 </el-check-tag>
                        <el-check-tag :checked="backChecked" type="primary" @change="toggleBack"> 后端提交记录 </el-check-tag>
                    </div>

                    <el-timeline v-if="!commitsError && commits.length > 0">
                        <el-timeline-item
                            v-for="commit in commits"
                            :key="commit.sha"
                            v-memo="[commit.sha, commit.commit.message]"
                            :timestamp="formatDate(commit.commit.author.date)"
                            :type="getCommitType(commit.commit.message)"
                        >
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
                                <el-checkbox v-model="todo.completed" @change="handleTodoChange(todo)" v-permission="['todo:delete', 'todo:edit']">
                                    <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                                </el-checkbox>
                                <div class="todo-actions">
                                    <el-button :disabled="todo.completed" v-permission="['todo:delete', 'todo:edit']" type="primary" link @click="editTodo(todo)">
                                        <el-icon><Edit /></el-icon>
                                    </el-button>
                                    <el-button v-permission="['todo:delete', 'todo:edit']" type="danger" link @click="deleteTodo(todo)">
                                        <el-icon><Delete /></el-icon>
                                    </el-button>
                                </div>
                            </div>
                            <div class="todo-meta">
                                <el-tag size="small" :type="PriorityMap[todo.priority]" effect="plain">{{ PriorityMapJson[todo.priority] }}</el-tag>
                                <span class="time"> 截止日期:{{ todo.deadline }}</span>
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

        <!-- 编辑待办事项 -->
        <el-dialog v-model="editTodoDialog" title="编辑待办事项" class="w-full max-w-md mx-auto" width="auto">
            <el-form ref="editTodoFormRef" :model="editTodoForm" label-width="100px" class="space-y-4" :rules="TODO_RULES">
                <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '标题不能为空', trigger: 'blur' }]">
                    <el-input v-model="editTodoForm.title" class="w-[220px]" />
                </el-form-item>
                <el-form-item label="截止日期" prop="deadline" :rules="[{ required: true, message: '请选择截止日期', trigger: 'change' }]">
                    <el-date-picker class="w-[220px]" v-model="editTodoForm.deadline" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="优先级" prop="priority" :rules="[{ required: true, message: '请选择优先级', trigger: 'change' }]">
                    <el-select v-model="editTodoForm.priority" placeholder="请选择优先级" class="w-[220px]">
                        <el-option v-for="item in Object.keys(PriorityMapJson)" :key="item" :label="PriorityMapJson[item]" :value="Number(item)" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="flex justify-end space-x-2">
                    <el-button type="primary" @click="saveEditTodo">保存</el-button>
                    <el-button @click="editTodoDialog = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="dashboard">
import { computed } from 'vue';
import { Plus, Delete, Refresh, Message, Edit } from '@element-plus/icons-vue';
import { getTimeState } from '@/utils';
import { formatDate } from '@/utils/time';
import { useTime } from '@/hooks/useTime';
import { useUserStore } from '@/stores/modules/user';
import { useGithubCommits } from '@/hooks/useGithubCommits';
import { useAMapLocationWeather } from '@/hooks/useAMapLocationWeather';
import { useDashboardTodo } from './hooks/useDashboardTodo';
import { useDashboardProject } from './hooks/useDashboadrProject';
import { PriorityMap, PriorityMapJson } from '@/views/dashboard/types';

// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
// 时间和天气信息
const greetingText = getTimeState();
const { nowTime } = useTime();
const { weatherInfo } = useAMapLocationWeather();

// 获取GitHub提交记录
const { commits, loading: commitsLoading, error: commitsError, fetchCommits, getCommitType, formatCommitMessage, frontChecked, backChecked, toggleFront, toggleBack } = useGithubCommits();
// 待办事项
const { todos, addTodo, handleTodoChange, deleteTodo, TODO_RULES, editTodo, editTodoDialog, editTodoForm, saveEditTodo, editTodoFormRef } = useDashboardTodo(userInfo.value!);

// 项目进度数据
const { projects } = useDashboardProject();
</script>
<style scoped lang="scss">
@import './index';
</style>
