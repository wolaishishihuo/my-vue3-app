import { ref, onMounted } from 'vue';
import { githubCommits } from '@/api/common';
import useLocalCache from './useLocalCache';
import { GITHUB_OWNER, GITHUB_REPO } from '@/config';

// 添加提交类型的类型定义
type CommitType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
type CommitTag = '1' | '2';

export interface CommitInfo {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
    };
    html_url: string;
    tag: CommitTag;
}

export function useGithubCommits(owner = GITHUB_OWNER, repo = GITHUB_REPO) {
    const commits = ref<CommitInfo[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { getCache, setCache, clearCache } = useLocalCache({
        // 1小时
        expiryTime: 1000 * 60 * 60 * 1
    });

    // 移除不需要的 refs
    const allCommits = ref<CommitInfo[]>([]);
    const frontChecked = ref(true);
    const backChecked = ref(true);

    // 更新筛选逻辑
    const filterCommits = () => {
        if (frontChecked.value && backChecked.value) {
            commits.value = allCommits.value; // 显示全部
        } else if (frontChecked.value) {
            commits.value = allCommits.value.filter(commit => commit.tag === '1');
        } else if (backChecked.value) {
            commits.value = allCommits.value.filter(commit => commit.tag === '2');
        } else {
            commits.value = []; // 都未选中时显示空列表
        }
    };

    const toggleFront = () => {
        frontChecked.value = !frontChecked.value;
        filterCommits();
    };

    const toggleBack = () => {
        backChecked.value = !backChecked.value;
        filterCommits();
    };

    const fetchCommits = async (page = 1, per_page = 10) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await githubCommits({
                page,
                per_page
            });
            allCommits.value = response.data as CommitInfo[];
            commits.value = allCommits.value; // 默认显示全部
            setCache('commits', allCommits.value);
        } catch (err: any) {
            error.value = err.message || '获取提交记录失败';
            console.error('Failed to fetch commits:', err);
        } finally {
            loading.value = false;
        }
    };
    // 优化获取提交类型的函数
    const getCommitType = (message: string): CommitType => {
        const commitTypes: Record<string, CommitType> = {
            feat: 'primary',
            fix: 'warning',
            docs: 'success',
            update: 'success',
            breaking: 'danger'
        };

        const lowerMessage = message.toLowerCase();
        return Object.entries(commitTypes).find(([key]) => lowerMessage.includes(key))?.[1] ?? 'info';
    };
    // 格式化提交信息
    const formatCommitMessage = (message: string) => {
        // 只取第一行作为标题
        return message.split('\n')[0];
    };
    onMounted(() => {
        clearCache(['commits']);
        const cachedCommits = getCache('commits');
        if (cachedCommits) {
            allCommits.value = cachedCommits as CommitInfo[];
            commits.value = allCommits.value; // 默认显示全部
        } else {
            fetchCommits();
        }
    });

    return {
        commits,
        loading,
        error,
        fetchCommits,
        getCommitType,
        formatCommitMessage,
        frontChecked,
        backChecked,
        toggleFront,
        toggleBack
    };
}
