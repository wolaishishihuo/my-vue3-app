# Axios 使用文档

## 概述

本项目中使用 Axios 作为 HTTP 客户端，用于与后端 API 进行通信。通过封装 Axios，我们提供了请求取消、重试机制、状态码检查等功能，以提高请求的可靠性和用户体验。

## 配置

Axios 实例通过 `HttpRequest` 类进行创建，基本配置如下：

- **`baseURL`**: 使用环境变量 `VITE_BASE_URL`，确保在不同环境下请求的正确性。
- **`timeout`**: 使用 `ResultEnum.TIMEOUT` 作为请求超时时间，防止请求长时间挂起。
- **`withCredentials`**: 允许跨域请求时携带凭证，适用于需要认证的请求。

### 示例

```typescript
const serviceConfig = {
    baseURL: VITE_BASE_URL,
    timeout: ResultEnum.TIMEOUT as number,
    withCredentials: true
};
```

## 请求取消

使用 `AxiosCanceler` 类来管理请求的取消。每个请求在发送前都会检查是否有重复请求，并在必要时取消。

### 示例

```typescript
const axiosCanceler = new AxiosCanceler();

// 添加请求
axiosCanceler.addPending(config);

// 移除请求
axiosCanceler.removePending(config);

// 清空所有请求
axiosCanceler.removeAllPending();
```

## 重试机制

通过 `retry` 函数实现请求的重试机制。可以在 `CustomAxiosRequestConfig` 中配置 `retryConfig` 来启用重试。

### 配置示例

```typescript
interface RetryConfig {
    isRetry: boolean; // 是否开启重试
    count?: number; // 重试次数，默认3次
    waitTime?: number; // 重试等待时间，默认1000ms
}
```

### 使用示例

在请求配置中启用重试机制：

```typescript
const config: CustomAxiosRequestConfig = {
    retryConfig: {
        isRetry: true,
        count: 3,
        waitTime: 1000
    }
};

// 使用示例
httpRequest.post('/api/data', { name: 'example' }, config)
    .then(response => {
        console.log('请求成功:', response);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });
```

## 状态码检查

使用 `checkStatus` 函数来处理不同的 HTTP 状态码，并显示相应的错误信息。

### 示例

```typescript
checkStatus(response.status, response);
```

## 请求方法

提供了常用的请求方法封装，支持 GET、POST、PUT、DELETE 和文件下载。

### 方法示例

```typescript
// GET 请求
httpRequest.get('/api/data', { id: 1 }).then(response => {
    console.log(response);
});

// POST 请求
httpRequest.post('/api/data', { name: 'example' }).then(response => {
    console.log(response);
});

// 文件下载
httpRequest.download('/api/file', { fileId: 123 }).then(blob => {
    // 处理下载的文件
});
```

## 接口定义

### Result

```typescript
interface Result {
    status: string;
    message: string;
    success: boolean;
}
```

### ResultData

```typescript
interface ResultData<T = any> extends Result {
    data: T;
}
```

### PageResult

```typescript
interface PageResult<T = any> {
    data: T[];
    total: number;
    pageNum: number;
    pageSize: number;
}
```

### CustomAxiosRequestConfig

```typescript
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    retryConfig?: RetryConfig;
    currentCount?: number;
    cancel?: boolean;
    loading?: boolean;
}
```
