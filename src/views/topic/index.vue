<template>
    <div class="discuss-container">
        <!-- 创建新话题按钮 -->
        <div class="create-topic">
            <el-button type="primary" @click="showCreateDialog">
                <el-icon><Plus /></el-icon>
                创建新话题
            </el-button>
        </div>

        <!-- 话题列表 -->
        <div class="topic-list">
            <el-card v-for="topic in topics" :key="topic.id" class="topic-item" @click="handleTopicClick(topic)">
                <div class="topic-header">
                    <el-avatar :src="topic.authorAvatar" />
                    <div class="topic-info">
                        <h3>{{ topic.title }}</h3>
                        <div class="topic-meta">
                            <span>{{ topic.author }}</span>
                            <span>{{ topic.createTime }}</span>
                            <span>{{ topic.replyCount }}回复</span>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 创建话题对话框 -->
        <el-dialog v-model="dialogVisible" title="创建新话题" width="50%">
            <el-form :model="newTopic" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="newTopic.title" placeholder="请输入话题标题" />
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="newTopic.content" type="textarea" :rows="6" placeholder="请输入话题内容" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="createTopic">发布</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

// 话题接口定义
interface Topic {
    id: number;
    title: string;
    content: string;
    author: string;
    authorId: number;
    authorAvatar: string;
    createTime: string;
    updateTime: string;
    replyCount: number;
    viewCount: number;
    lastReplyTime?: string;
    lastReplyUser?: string;
    status: TopicStatus;
    tags?: string[];
}

// 新建话题的表单数据接口
interface TopicForm {
    title: string;
    content: string;
    tags?: string[];
}

// 话题状态枚举
enum TopicStatus {
    NORMAL = 'normal',
    PINNED = 'pinned',
    CLOSED = 'closed'
}

// 话题列表数据
const topics = ref<Topic[]>([]);

// 对话框显示状态
const dialogVisible = ref(false);

// 新话题表单数据
const newTopic = ref<TopicForm>({
    title: '',
    content: '',
    tags: []
});

// 显示创建话题对话框
const showCreateDialog = () => {
    dialogVisible.value = true;
};

// 创建新话题
const createTopic = async () => {
    try {
        // TODO: 实现创建话题的API调用
        // const response = await createTopicApi(newTopic.value)
        console.log('创建新话题:', newTopic.value);
        dialogVisible.value = false;
        newTopic.value = { title: '', content: '', tags: [] };
        // 刷新话题列表
        await getTopics();
    } catch (error) {
        console.error('创建话题失败:', error);
        // TODO: 显示错误提示
    }
};

// 获取话题列表
const getTopics = async () => {
    try {
        // TODO: 实现获取话题列表的API调用
        // const response = await getTopicsApi()
        topics.value = [
            {
                id: 1,
                title: '示例话题',
                content: '示例内容',
                author: '张三',
                authorId: 1,
                authorAvatar: 'https://example.com/avatar.jpg',
                createTime: '2024-03-20 10:00',
                updateTime: '2024-03-20 10:00',
                replyCount: 5,
                viewCount: 100,
                status: TopicStatus.NORMAL,
                tags: ['前端', 'Vue']
            }
        ];
    } catch (error) {
        console.error('获取话题列表失败:', error);
        // TODO: 显示错误提示
    }
};

// 处理话题点击
const router = useRouter();

const handleTopicClick = (topic: Topic) => {
    router.push(`/topic/detail/${topic.id}`);
};

onMounted(() => {
    getTopics();
});
</script>

<style scoped lang="scss">
.discuss-container {
    padding: 20px;
    .create-topic {
        margin-bottom: 20px;
    }
    .topic-list {
        .topic-item {
            margin-bottom: 16px;
            cursor: pointer;
            &:hover {
                box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            }
        }
        .topic-header {
            display: flex;
            gap: 16px;
            align-items: center;
        }
        .topic-info {
            flex: 1;
            h3 {
                margin: 0 0 8px;
            }
            .topic-meta {
                font-size: 14px;
                color: #999999;
                span {
                    margin-right: 16px;
                }
            }
        }
    }
}
</style>
