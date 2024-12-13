<template>
    <div class="topic-detail-container">
        <!-- 话题主体内容 -->
        <el-card class="topic-main">
            <div class="topic-header">
                <h1>{{ topic.title }}</h1>
                <div class="topic-meta">
                    <el-avatar :src="topic.authorAvatar" />
                    <span class="author">{{ topic.author }}</span>
                    <span class="time">发布于 {{ topic.createTime }}</span>
                    <span class="views">{{ topic.viewCount }} 次浏览</span>
                </div>
            </div>
            <div class="topic-content">
                {{ topic.content }}
            </div>
            <div class="topic-tags" v-if="topic.tags?.length">
                <el-tag v-for="tag in topic.tags" :key="tag" size="small">{{ tag }}</el-tag>
            </div>
        </el-card>

        <!-- 回复列表 -->
        <div class="reply-section">
            <h2>{{ replies.length }} 条回复</h2>
            <el-card v-for="reply in replies" :key="reply.id" class="reply-item">
                <div class="reply-header">
                    <el-avatar :src="reply.authorAvatar" size="small" />
                    <span class="author">{{ reply.author }}</span>
                    <span class="time">{{ reply.createTime }}</span>
                </div>
                <div class="reply-content" v-html="reply.content"></div>

                <!-- 添加回复操作区 -->
                <div class="reply-operations">
                    <el-button type="text" @click="showReplyInput(reply)">回复</el-button>
                </div>

                <!-- 添加子回复列表 -->
                <div class="sub-replies" v-if="reply.children?.length">
                    <div v-for="subReply in reply.children" :key="subReply.id" class="sub-reply-item">
                        <div class="reply-header">
                            <el-avatar :src="subReply.authorAvatar" size="small" />
                            <span class="author">{{ subReply.author }}</span>
                            <span class="reply-to">回复</span>
                            <span class="target-author">{{ subReply.replyToUser }}</span>
                            <span class="time">{{ subReply.createTime }}</span>
                        </div>
                        <div class="reply-content" v-html="subReply.content"></div>
                        <div class="reply-operations">
                            <el-button type="text" @click="showReplyInput(reply, subReply)">回复</el-button>
                        </div>
                    </div>
                </div>

                <!-- 回复输入框 -->
                <div v-if="activeReply?.id === reply.id" class="sub-reply-input">
                    <div class="editor-container">
                        <el-input v-model="subReplyContent" type="textarea" :rows="3" :placeholder="replyPlaceholder" />
                    </div>
                    <div class="reply-actions">
                        <el-button @click="cancelReply">取消</el-button>
                        <el-button type="primary" @click="submitSubReply(reply)">回复</el-button>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 发表回复 -->
        <el-card class="reply-form">
            <h3>发表回复</h3>
            <div class="editor-container">
                <Toolbar :editor="editorRef" :default-config="toolbarConfig" style="border: 1px solid #ccc" />
                <Editor
                    v-model="newReply.content"
                    :default-config="editorConfig"
                    @on-created="handleCreated"
                    @on-change="handleChange"
                    style="height: 400px; overflow-y: hidden; border: 1px solid #ccc; margin-top: 10px"
                />
            </div>
            <div class="reply-actions">
                <el-button type="primary" @click="submitReply">发表回复</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
// 回复接口定义
interface Reply {
    id: number;
    content: string;
    author: string;
    authorId: number;
    authorAvatar: string;
    createTime: string;
    topicId: number;
    children?: Reply[];
    parentId?: number;
    replyToUser?: string;
    replyToUserId?: number;
}

const route = useRoute();
const topicId = route.params.id;
const editorRef = shallowRef();
const activeReply = ref<Reply | null>(null);
const subReplyContent = ref('');
const replyPlaceholder = ref('');
// 工具栏配置
const toolbarConfig = {
    excludeKeys: ['uploadVideo', 'insertTable', 'group-video', 'codeBlock', 'fullScreen']
};
// 编辑器配置
const editorConfig = {
    placeholder: '请输入回复内容...',
    MENU_CONF: {
        uploadImage: {
            server: '/api/upload',
            maxNumberOfFiles: 10
        }
    }
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor: any) => {
    editorRef.value = editor;
};

const handleChange = (editor: any) => {
    newReply.value.content = editor.getHtml();
};

// 显示回复输入框
const showReplyInput = (reply: Reply, subReply?: Reply) => {
    activeReply.value = reply;
    subReplyContent.value = '';
    replyPlaceholder.value = subReply ? `回复 ${subReply.author}：` : `回复 ${reply.author}：`;
};

// 取消回复
const cancelReply = () => {
    activeReply.value = null;
    subReplyContent.value = '';
};

// 提交子回复
const submitSubReply = async (parentReply: Reply) => {
    try {
        if (!subReplyContent.value.trim()) {
            ElMessage.warning('请输入回复内容');
            return;
        }

        // TODO: 实现提交子回复的API调用
        // const response = await createSubReplyApi({
        //     topicId: topicId,
        //     parentId: parentReply.id,
        //     content: subReplyContent.value,
        //     replyToUserId: activeReply.value?.replyToUserId || parentReply.authorId,
        // });

        // 清空输入框并隐藏
        cancelReply();

        // 刷新回复列表
        await getReplies();

        ElMessage.success('回复成功');
    } catch (error) {
        console.error('提交回复失败:', error);
        ElMessage.error('回复失败，请重试');
    }
};

// 修改获取回复列表的示例数据
const getReplies = async () => {
    try {
        // TODO: 实现获取回复列表的API调用
        replies.value = [
            {
                id: 1,
                content: '示例回复内容1',
                author: '李四',
                authorId: 2,
                authorAvatar: 'https://example.com/avatar2.jpg',
                createTime: '2024-03-20 11:00',
                topicId: 1,
                children: [
                    {
                        id: 3,
                        content: '示例子回复内容',
                        author: '赵六',
                        authorId: 4,
                        authorAvatar: 'https://example.com/avatar4.jpg',
                        createTime: '2024-03-20 11:30',
                        topicId: 1,
                        parentId: 1,
                        replyToUser: '李四',
                        replyToUserId: 2
                    }
                ]
            }
            // ... 其他回复
        ];
    } catch (error) {
        console.error('获取回复列表失败:', error);
    }
};

// 话题详情数据
const topic = ref({
    id: 1,
    title: '示例话题标题',
    content: '示例话题详细内容...',
    author: '张三',
    authorId: 1,
    authorAvatar: 'https://example.com/avatar.jpg',
    createTime: '2024-03-20 10:00',
    updateTime: '2024-03-20 10:00',
    replyCount: 2,
    viewCount: 100,
    tags: ['前端', 'Vue']
});

// 回复列表
const replies = ref<Reply[]>([]);

// 新回复表单
const newReply = ref({
    content: ''
});

// 获取话题详情
const getTopicDetail = async () => {
    try {
        // TODO: 实现获取话题详情的API调用
        // const response = await getTopicDetailApi(topicId);
        // topic.value = response.data;
    } catch (error) {
        console.error('获取话题详情失败:', error);
    }
};

// 修改提交回复函数
const submitReply = async () => {
    try {
        if (!newReply.value.content.trim()) {
            ElMessage.warning('请输入回复内容');
            return;
        }
        // TODO: 实现提交回复的API调用
        // await createReplyApi({
        //     topicId,
        //     content: newReply.value.content,
        // })

        // 清空编辑器内容
        editorRef.value.clear();
        newReply.value.content = '';

        // 刷新回复列表
        await getReplies();

        ElMessage.success('回复成功');
    } catch (error) {
        console.error('提交回复失败:', error);
        ElMessage.error('回复失败，请重试');
    }
};

onMounted(() => {
    getTopicDetail();
    getReplies();
});
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
