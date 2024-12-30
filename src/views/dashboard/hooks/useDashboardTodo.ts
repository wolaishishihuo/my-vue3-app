import { computed, ref, watch } from 'vue';
import type { TodoItem } from '@/types/dashboard';
import { Priority, PriorityMap } from '@/types/dashboard';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import useLocalCache from '@/hooks/useLocalCache';
import useAuthButtons from '@/hooks/useAuthButtons';
import { CACHE_KEYS } from '@/config';
// 默认待办事项
const DEFAULT_TODO: TodoItem = {
    id: '1',
    content: '首页开发',
    completed: true,
    deadline: '2024-01-01',
    priority: Priority.Success,
    priorityLabel: PriorityMap[Priority.Success],
    createTime: new Date().toISOString()
};

// 表单验证规则
const TODO_RULES: FormRules = {
    content: [
        {
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
        }
    ],
    deadline: [
        {
            required: true,
            message: '请选择截止日期',
            trigger: 'change'
        }
    ],
    priority: [
        {
            required: true,
            message: '请选择优先级',
            trigger: 'change'
        }
    ]
};

export function useDashboardTodo() {
    const todos = ref<TodoItem[]>([]);
    const editTodoDialog = ref(false);
    const { getCache, setCache } = useLocalCache<TodoItem[]>({
        // 1年以后过期
        expiryTime: 1000 * 60 * 60 * 24 * 365
    });
    const { hasPermission } = useAuthButtons();
    const editTodoFormRef = ref<FormInstance | null>(null);

    // 使用计算属性获取新的 ID
    const newTodoId = computed(() => String(todos.value.length + 1));
    const editTodoForm = ref<TodoItem>({
        id: '',
        content: '',
        completed: false,
        deadline: '',
        priority: Priority.Info,
        priorityLabel: PriorityMap[Priority.Info],
        createTime: new Date().toISOString()
    });
    // 监听todos的变化，并缓存到本地
    watch(todos, () => {
        setCache(CACHE_KEYS.todoKey, todos.value);
    });
    // 权限检查包装器
    const withPermission = (action: string, callback: () => void) => {
        if (!hasPermission(`todo:${action}`)) {
            ElMessage.warning(`您没有${action === 'add' ? '添加' : '编辑'}待办事项的权限`);
            return false;
        }
        callback();
        return true;
    };
    const getTodos = () => {
        const cachedTodos = getCache(CACHE_KEYS.todoKey);
        todos.value = cachedTodos || [DEFAULT_TODO];
    };
    getTodos();

    const addTodo = () => {
        withPermission('add', () => {
            const newTodo: TodoItem = {
                id: newTodoId.value,
                content: '新的待办事项',
                completed: false,
                deadline: '待设置',
                priority: Priority.Info,
                priorityLabel: PriorityMap[Priority.Info],
                createTime: new Date().toISOString()
            };
            todos.value.unshift(newTodo);
            ElMessage.success('添加成功');
        });
    };
    // 方法：处理待办事项状态变化
    const handleTodoChange = (todo: TodoItem) => {
        withPermission('edit', () => {
            const index = todos.value.findIndex(item => item.id === todo.id);
            if (index !== -1) {
                todos.value[index] = { ...todo };
                ElMessage.success(todo.completed ? '已完成' : '已取消完成');
            }
        });
    };

    // 方法：编辑待办事项
    const editTodo = (todo: TodoItem) => {
        withPermission('edit', () => {
            editTodoDialog.value = true;
            editTodoForm.value = { ...todo };
        });
    };

    // 保存编辑的待办事项
    const saveEditTodo = async () => {
        try {
            if (!editTodoFormRef.value) return;
            const valid = await editTodoFormRef.value.validate();
            if (!valid) return;

            const index = todos.value.findIndex(item => item.id === editTodoForm.value.id);
            if (index !== -1) {
                editTodoForm.value.priorityLabel = PriorityMap[editTodoForm.value.priority as keyof typeof PriorityMap];
                todos.value[index] = { ...editTodoForm.value };
                editTodoDialog.value = false;
                ElMessage.success('编辑成功');
            }
        } catch {
            ElMessage.error('保存失败，请重试');
        }
    };

    // 删除待办事项
    const deleteTodo = (todo: TodoItem) => {
        ElMessageBox.confirm(`确定要删除待办事项 "${todo.content}" 吗？`, '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            const index = todos.value.findIndex(item => item.id === todo.id);
            if (index !== -1) {
                todos.value.splice(index, 1);
                ElMessage.success('删除成功');
            }
        });
    };

    return {
        editTodoFormRef,
        todos,
        editTodoDialog,
        editTodoForm,
        addTodo,
        handleTodoChange,
        editTodo,
        saveEditTodo,
        getTodos,
        deleteTodo,
        TODO_RULES
    };
}
