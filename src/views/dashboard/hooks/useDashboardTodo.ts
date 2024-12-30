import { ref, shallowRef } from 'vue';
import type { TodoItem } from '@/types/dashboard';
import { Priority, PriorityMap } from '@/types/dashboard';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import useLocalCache from '@/hooks/useLocalCache';
import useAuthButtons from '@/hooks/useAuthButtons';

export function useDashboardTodo() {
    const todos = shallowRef<TodoItem[]>([]);
    const editTodoDialog = ref(false);
    const { getCache, setCache } = useLocalCache<TodoItem[]>({
        // 1年以后过期
        expiryTime: 1000 * 60 * 60 * 24 * 365
    });
    const { hasPermission } = useAuthButtons();
    const editTodoFormRef = ref<FormInstance | null>(null);

    const editTodoForm = ref<TodoItem>({
        id: '',
        content: '',
        completed: false,
        deadline: '',
        priority: Priority.Info,
        priorityLabel: PriorityMap[Priority.Info],
        createTime: new Date().toISOString()
    });

    const getTodos = () => {
        const cachedTodos = getCache('todos');
        todos.value = cachedTodos || [
            {
                id: '1',
                content: '首页开发',
                completed: true,
                deadline: '2024-01-01',
                priority: Priority.Success,
                priorityLabel: PriorityMap[Priority.Success],
                createTime: new Date().toISOString()
            }
        ];
    };
    getTodos();

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
            priority: Priority.Info,
            priorityLabel: PriorityMap[Priority.Info],
            createTime: new Date().toISOString()
        };
        todos.value.unshift(newTodo);
        setCache('todos', todos.value);
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
    // 验证表单的辅助函数
    const validateForm = async () => {
        if (!editTodoFormRef.value) return false;
        return await editTodoFormRef.value.validate();
    };

    // 保存编辑的待办事项
    const saveEditTodo = async () => {
        try {
            const valid = await validateForm();
            if (!valid) return;

            const index = todos.value.findIndex(item => item.id === editTodoForm.value.id);
            if (index !== -1) {
                editTodoForm.value.priorityLabel = PriorityMap[editTodoForm.value.priority as keyof typeof PriorityMap];
                todos.value[index] = { ...editTodoForm.value };
                setCache('todos', todos.value);
                editTodoDialog.value = false;
                getTodos();
                ElMessage.success('编辑成功');
            }
        } catch (error) {
            ElMessage.error('保存失败，请重试');
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

    // 表单验证规则
    const editTodoRules = {
        content: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
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
        confirmDelete,
        getTodos,
        editTodoRules
    };
}
