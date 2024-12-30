import { ref, onMounted } from 'vue';
import { getRepositoryCommits } from '@/api/github';
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
    const { getCache, setCache } = useLocalCache({
        // 1小时
        expiryTime: 1000 * 60 * 60 * 1
    });

    const fetchCommits = async (page = 1, perPage = 10) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await getRepositoryCommits({
                owner,
                repo,
                page,
                per_page: perPage
            });
            commits.value = response as CommitInfo[];
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
        const cachedCommits = getCache('commits');
        if (cachedCommits) {
            commits.value = cachedCommits as CommitInfo[];
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
        formatCommitMessage
    };
}
