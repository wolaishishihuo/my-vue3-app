<template>
    <div class="system-log-container p-8 bg-gray-50 shadow-lg rounded-xl">
        <div class="flex items-center mb-6">
            <el-input v-model="searchQuery" placeholder="搜索日志..." class="mr-4" size="large" clearable />
            <el-select v-model="logType" placeholder="选择日志类型" class="mr-4" size="large" clearable>
                <el-option label="所有" value=""></el-option>
                <el-option label="错误" value="error"></el-option>
                <el-option label="警告" value="warning"></el-option>
                <el-option label="信息" value="info"></el-option>
            </el-select>
            <el-button @click="exportLogs" type="primary" size="large">导出日志</el-button>
        </div>
        <el-table :data="logs" border stripe class="shadow-md rounded-lg w-full">
            <el-table-column align="center" prop="time" label="时间" width="180"></el-table-column>
            <el-table-column align="center" prop="type" label="类型" width="100"></el-table-column>
            <el-table-column align="center" prop="user" label="用户" width="120"></el-table-column>
            <el-table-column align="center" prop="description" label="描述"></el-table-column>
        </el-table>
    </div>
</template>

<script setup name="systemLog">
import { ref } from 'vue';

const searchQuery = ref('');
const logType = ref('');
const logs = ref([]);

// 模拟获取日志数据
const fetchLogs = () => {
    logs.value = [
        { time: '2023-12-26 10:00', type: 'info', user: 'admin', description: '系统启动' },
        { time: '2023-12-26 10:05', type: 'error', user: 'user1', description: '登录失败' }
        // 更多日志数据...
    ];
};

const exportLogs = () => {
    // 实现导出功能
    console.log('导出日志');
};

fetchLogs();
</script>
