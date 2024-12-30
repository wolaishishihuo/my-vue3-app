import { ref } from 'vue';
import type { Project } from '@/types/dashboard';

// 项目进度
export function useDashboardProject() {
    // 项目进度数据
    const projects = ref<Project[]>([
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
    ]);

    return {
        projects
    };
}
