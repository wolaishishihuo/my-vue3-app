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

export interface TodoItem {
    id: string;
    content: string;
    completed: boolean;
    deadline: string;
    priority: 'success' | 'warning' | 'info' | 'primary' | 'danger';
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
