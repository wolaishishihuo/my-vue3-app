import { dayjs } from 'element-plus';

// 格式化日期
export const formatDate = (date: Date | string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');
