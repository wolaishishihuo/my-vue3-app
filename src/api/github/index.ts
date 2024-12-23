import { GITHUB_API_BASE } from '@/config';

// 获取仓库提交记录
export const getRepositoryCommits = async (params: { owner: string; repo: string; per_page?: number; page?: number }) => {
    const { owner, repo, per_page = 10, page = 1 } = params;
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${per_page}&page=${page}`, {
        method: 'GET'
    });
    return await response.json();
};
