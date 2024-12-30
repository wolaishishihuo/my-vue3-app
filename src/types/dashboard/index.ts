export interface Activity {
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
export const enum Priority {
    Success = 'success',
    Warning = 'warning',
    Info = 'info',
    Primary = 'primary',
    Danger = 'danger'
}

export interface TodoItem {
    id: string;
    content: string;
    completed: boolean;
    deadline: string;
    priority: Priority;
    priorityLabel: string;
    createTime: string;
}

export interface Project {
    id: string;
    name: string;
    percentage: number;
    status: '' | 'success' | 'exception' | 'warning';
    startTime: string;
    endTime: string;
}

export const PriorityMap = {
    [Priority.Success]: '成功',
    [Priority.Warning]: '紧急',
    [Priority.Info]: '普通',
    [Priority.Primary]: '重要',
    [Priority.Danger]: '危险'
} as const;
