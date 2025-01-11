import http from '@/http';
import { TodoItem } from '@/types/dashboard';

// 获取用户信息
export const getUserInfoApi = () => {
    return http.get<User.UserInfo>('/user/findUser');
};

// 获取登录人待办事项
export const getUserTodoListApi = () => {
    return http.get<TodoItem[]>('/user/getTodoList');
};
// 修改待办事项
export const updateUserTodoListApi = (params: TodoItem) => {
    return http.post('/user/updateTodo', params);
};
// 删除待办事项
export const deleteUserTodoListApi = (params: Pick<TodoItem, 'id'>) => {
    return http.post('/user/deleteTodo', params);
};
// 添加待办事项
export const addUserTodoListApi = (params: Omit<TodoItem, 'id'>) => {
    return http.post('/user/createTodo', params);
};
