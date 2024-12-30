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
                                今天是:<span class="highlight">{{ ` ${nowTime}, ` }}</span> 当前所在地: <span class="highlight">{{ `${locationInfo?.province} ${locationInfo?.city}, ` }}</span> 天气:
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
                                <el-checkbox v-model="todo.completed" @change="handleTodoChange(todo)" v-permission="['todo:delete', 'todo:edit']">
                                    <span :class="{ completed: todo.completed }">{{ todo.content }}</span>
                                </el-checkbox>
                                <div class="todo-actions">
                                    <el-button :disabled="todo.completed" v-permission="['todo:delete', 'todo:edit']" type="primary" link @click="editTodo(todo)">
                                        <el-icon><Edit /></el-icon>
                                    </el-button>
                                    <el-button v-permission="['todo:delete', 'todo:edit']" type="danger" link @click="confirmDelete(todo)">
                                        <el-icon><Delete /></el-icon>
                                    </el-button>
                                </div>
                            </div>
                            <div class="todo-meta">
                                <el-tag size="small" :type="todo.priority">{{ todo.priority }}</el-tag>
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

        <!-- 编辑待办事项 -->
        <el-dialog v-model="editTodoDialog" title="编辑待办事项" class="w-full max-w-md mx-auto" width="auto">
            <el-form :model="editTodoForm" label-width="100px" class="space-y-4" :rules="rules">
                <el-form-item label="标题" prop="content" :rules="[{ required: true, message: '标题不能为空', trigger: 'blur' }]">
                    <el-input v-model="editTodoForm.content" class="w-[220px]" />
                </el-form-item>
                <el-form-item label="截止日期" prop="deadline" :rules="[{ required: true, message: '请选择截止日期', trigger: 'change' }]">
                    <el-date-picker class="w-[220px]" v-model="editTodoForm.deadline" type="datetime" />
                </el-form-item>
                <el-form-item label="优先级" prop="priority" :rules="[{ required: true, message: '请选择优先级', trigger: 'change' }]">
                    <el-select v-model="editTodoForm.priority" placeholder="请选择优先级" class="w-[220px]">
                        <el-option label="成功" value="success" />
                        <el-option label="警告" value="warning" />
                        <el-option label="信息" value="info" />
                        <el-option label="主要" value="primary" />
                        <el-option label="危险" value="danger" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="flex justify-end space-x-2">
                    <el-button type="primary" @click="saveEditTodo" class="bg-blue-500 hover:bg-blue-600 text-white">保存</el-button>
                    <el-button @click="editTodoDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="dashboard">
import { ref, computed } from 'vue';
import { Plus, Delete, Refresh, Message, Edit } from '@element-plus/icons-vue';
import { getTimeState } from '@/utils';
import { formatDate } from '@/utils/time';
import { useTime } from '@/hooks/useTime';
import { useUserStore } from '@/stores/modules/user';
import { TodoItem, Project } from './interface';
import { ElMessage, ElMessageBox, ElInput, ElSelect, ElOption } from 'element-plus';
import { useGithubCommits } from '@/hooks/useGithubCommits';
import { GITHUB_OWNER, GITHUB_REPO } from '@/config';
import { useAMapLocationWeather } from '@/hooks/useAMapLocationWeather';
import useAuthButtons from '@/hooks/useAuthButtons';
import useLocalCache from '@/hooks/useLocalCache';
// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const { getCache, setCache } = useLocalCache<TodoItem[]>();

const greetingText = getTimeState();
const { nowTime } = useTime();
const { locationInfo, weatherInfo } = useAMapLocationWeather();
const { commits, loading: commitsLoading, error: commitsError, fetchCommits, getCommitType, formatCommitMessage } = useGithubCommits(GITHUB_OWNER, GITHUB_REPO);
const { todos, addTodo, handleTodoChange, confirmDelete, editTodo, editTodoDialog, editTodoForm, saveEditTodo } = useTodo();
const { hasPermission } = useAuthButtons();

// 待办事项
function useTodo() {
    // 待办事项数据
    const todos = ref<TodoItem[]>([]);
    const editTodoDialog = ref(false);
    const editTodoForm = ref<TodoItem>({
        id: '',
        content: '',
        completed: false,
        deadline: '',
        priority: 'info',
        priorityLabel: '普通',
        createTime: new Date().toISOString()
    });

    // 从缓存中获取
    const getTodos = () => {
        const cachedTodos = getCache('todos');
        if (cachedTodos) {
            todos.value = cachedTodos;
        }
    };
    getTodos();
    // 方法：添加待办事项
    const addTodo = () => {
        if (!hasPermission('todo:add')) {
            ElMessage.warning('您没有添加待办事项的权限');
            return;
        }
        const newTodo: TodoItem = {
            id: String(todos.value.length + 1),
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
            setCache('todos', todos.value);
            ElMessage.success(todo.completed ? '已完成' : '已取消完成');
        }
    };

    // 方法：编辑待办事项
    const editTodo = (todo: TodoItem) => {
        if (!hasPermission('todo:edit')) {
            ElMessage.warning('您没有编辑待办事项的权限');
            return;
        }
        editTodoDialog.value = true;
        editTodoForm.value = { ...todo };
    };

    const saveEditTodo = () => {
        const index = todos.value.findIndex(item => item.id === editTodoForm.value.id);
        if (index !== -1) {
            todos.value[index] = { ...editTodoForm.value };
            setCache('todos', todos.value);
            editTodoDialog.value = false;
            getTodos();
            ElMessage.success('编辑成功');
        }
    };

    // 删除待办事项
    const deleteTodo = (todo: TodoItem) => {
        const index = todos.value.findIndex(item => item.id === todo.id);
        if (index !== -1) {
            todos.value.splice(index, 1);
            ElMessage.success('删除成功');
            setCache('todos', todos.value);
        }
    };

    // 确认删除对话框
    const confirmDelete = (todo: TodoItem) => {
        ElMessageBox.confirm(`确定要删除待办事项 "${todo.content}" 吗？`, '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteTodo(todo);
        });
    };

    return { todos, addTodo, handleTodoChange, deleteTodo, confirmDelete, editTodo, editTodoDialog, editTodoForm, saveEditTodo };
}

// 项目进度数据
const projects: Project[] = [
    {
        id: '1',
        name: '用户中心',
        percentage: 90,
        status: 'success',
        startTime: '2023-12-01',
        endTime: '2023-12-31'
    },
    {
        id: '2',
        name: '数据分析',
        percentage: 70,
        status: 'warning',
        startTime: '2023-12-01',
        endTime: '2024-01-31'
    },
    {
        id: '4',
        name: '支付系统',
        percentage: 30,
        status: 'exception',
        startTime: '2023-12-15',
        endTime: '2024-02-28'
    }
];

// 表单验证规则
const rules = {
    content: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
    priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
};
</script>
<style scoped lang="scss">
@import './index';
</style>
