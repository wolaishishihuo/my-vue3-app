import http from '@/http';
import type { TodoItem } from '@/views/dashboard/types';

// 获取用户信息
export const getUserInfoApi = () => {
    return http.get<User.UserInfo>('/user/findUser');
};
// 获取用户角色
export const getUserRoleApi = () => {
    return http.get<User.UserRole[]>('/user/findUserRole');
};

// 获取登录人待办事项
export const getUserTodoListApi = () => {
    return http.get<TodoItem[]>('/todo/getTodoList');
};
// 修改待办事项
export const updateUserTodoListApi = (params: TodoItem) => {
    return http.post('/todo/updateTodo', params);
};
// 删除待办事项
export const deleteUserTodoListApi = (params: Pick<TodoItem, 'id'>) => {
    return http.post('/todo/deleteTodo', params);
};
// 添加待办事项
export const addUserTodoListApi = (params: Omit<TodoItem, 'id'>) => {
    return http.post('/todo/createTodo', params);
};
