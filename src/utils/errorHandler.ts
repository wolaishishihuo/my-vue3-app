import { ElNotification } from 'element-plus';
import { useThrottleFn } from '@vueuse/core';

const errorMap: Record<string, string> = {
    InternalError: 'Javascript引擎内部错误',
    ReferenceError: '未找到对象',
    TypeError: '使用了错误的类型或对象',
    RangeError: '使用内置对象时，参数超范围',
    SyntaxError: '语法错误',
    EvalError: '错误的使用了Eval',
    URIError: 'URI错误'
};

// 使用 VueUse 的 useThrottleFn 来节流，避免重复报错
const showNotification = useThrottleFn((title: string, message: string) => {
    ElNotification({
        title,
        message: message || '未知错误',
        type: 'error',
        duration: 3000
    });
}, 300);

const errorHandler = (error: any) => {
    // 过滤 HTTP 请求错误
    if (error?.status || error?.request?.status || error?.request?.status === 0) {
        return false;
    }

    const errorName = errorMap[error.name] || '未知错误';
    const errorMessage = error.message || String(error);
    console.log(errorName, errorMessage);
    showNotification(errorName, errorMessage);
};

export default errorHandler;
