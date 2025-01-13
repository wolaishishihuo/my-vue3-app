import { ref, watch } from 'vue';
import type { TodoItem } from '@/views/dashboard/types';
import { Priority } from '@/views/dashboard/types';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import useLocalCache from '@/hooks/useLocalCache';
import useAuthButtons from '@/hooks/useAuthButtons';
import { CACHE_KEYS } from '@/config';
import { getUserTodoListApi, updateUserTodoListApi, deleteUserTodoListApi, addUserTodoListApi } from '@/api/user';
import { formatDate } from '@/utils/time';

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

export function useDashboardTodo(userInfo: User.UserInfo) {
    const todos = ref<TodoItem[]>([]);
    const editTodoDialog = ref(false);
    const { getCache, setCache } = useLocalCache<TodoItem[]>({
        // 1年以后过期
        expiryTime: 1000 * 60 * 60 * 24 * 365
    });
    const { hasPermission } = useAuthButtons();
    const editTodoFormRef = ref<FormInstance | null>(null);

    const editTodoForm = ref<TodoItem>({
        id: '',
        title: '',
        status: 0,
        completed: false,
        deadline: '',
        priority: Priority.Info
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
    const getTodos = async () => {
        // const cachedTodos = getCache(CACHE_KEYS.todoKey);
        // if (cachedTodos) {
        //     todos.value = cachedTodos;
        //     return;
        // }
        const { data } = await getUserTodoListApi();
        todos.value = (data as TodoItem[]).map(item => ({ ...item, completed: !!item.status }));
    };
    getTodos();

    const addTodo = () => {
        withPermission('add', async () => {
            const newTodo: Omit<TodoItem, 'id'> = {
                userId: userInfo.id,
                title: '新的待办事项',
                status: 0,
                completed: false,
                deadline: formatDate(new Date()),
                priority: Priority.Info
            };
            const { success } = await addUserTodoListApi(newTodo);
            if (success) {
                ElMessage.success('添加成功');
                getTodos();
            }
        });
    };
    // 方法：处理待办事项状态变化
    const handleTodoChange = (todo: TodoItem) => {
        withPermission('edit', async () => {
            const { success } = await updateUserTodoListApi({ ...todo, status: todo.completed ? 1 : 0 });
            if (success) {
                ElMessage.success(todo.completed ? '已完成' : '已取消完成');
                getTodos();
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
            const { success } = await updateUserTodoListApi({ ...editTodoForm.value, status: editTodoForm.value.status ? 1 : 0 });
            if (success) {
                ElMessage.success('编辑成功');
                getTodos();
            }
        } catch {
            ElMessage.error('保存失败，请重试');
        } finally {
            editTodoDialog.value = false;
        }
    };

    // 删除待办事项
    const deleteTodo = (todo: Pick<TodoItem, 'id' | 'title'>) => {
        withPermission('delete', () => {
            ElMessageBox.confirm(`确定要删除待办事项 "${todo.title}" 吗？`, '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { success } = await deleteUserTodoListApi({ id: todo.id });
                if (success) {
                    ElMessage.success('删除成功');
                    getTodos();
                }
            });
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
