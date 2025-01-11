import { ref, onMounted } from 'vue';
import { githubCommits } from '@/api/common';
import useLocalCache from './useLocalCache';
import { GITHUB_OWNER, GITHUB_REPO } from '@/config';

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
}

export function useGithubCommits(owner = GITHUB_OWNER, repo = GITHUB_REPO) {
    const commits = ref<CommitInfo[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { getCache, setCache, clearCache } = useLocalCache({
        // 1小时
        expiryTime: 1000 * 60 * 60 * 1
    });

    const fetchCommits = async (page = 1, per_page = 10) => {
        console.log('fetchCommits');
        loading.value = true;
        error.value = null;
        try {
            const response = await githubCommits({
                page,
                per_page
            });
            commits.value = response.data as CommitInfo[];
            setCache('commits', commits.value);
        } catch (err: any) {
            error.value = err.message || '获取提交记录失败';
            console.error('Failed to fetch commits:', err);
        } finally {
            loading.value = false;
        }
    };
    // 获取提交类型
    const getCommitType = (message: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('feat')) return 'primary';
        if (lowerMessage.includes('fix')) return 'warning';
        if (lowerMessage.includes('docs')) return 'success';
        if (lowerMessage.includes('update')) return 'success';
        if (lowerMessage.includes('breaking')) return 'danger';
        return 'info';
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
            commits.value = cachedCommits as CommitInfo[];
        } else {
            console.log('fetchCommits');
            fetchCommits();
        }
    });

    return {
        commits,
        loading,
        error,
        fetchCommits,
        getCommitType,
        formatCommitMessage
    };
}
