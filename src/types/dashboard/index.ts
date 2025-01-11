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
    Info = 0,
    Success = 1,
    Warning = 2,
    Primary = 3,
    Danger = 4
}

export interface TodoItem {
    id: string;
    userId?: string;
    title: string;
    status: 0 | 1;
    completed: boolean;
    deadline: string;
    priority: keyof typeof PriorityMap;
}

export interface Project {
    id: string;
    name: string;
    percentage: number;
    status: '' | 'success' | 'exception' | 'warning';
    startTime: string;
    endTime: string;
}

export const PriorityMapJson = {
    [Priority.Info]: '普通',
    [Priority.Success]: '成功',
    [Priority.Warning]: '紧急',
    [Priority.Primary]: '重要',
    [Priority.Danger]: '危险'
} as const;

export const PriorityMap = {
    [Priority.Success]: 'success',
    [Priority.Warning]: 'warning',
    [Priority.Info]: 'info',
    [Priority.Primary]: 'primary',
    [Priority.Danger]: 'danger'
} as const;
