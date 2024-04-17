import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];
type ProxyTargetList = Record<string, ProxyOptions>;

export const creatProxy = (list: ProxyList): ProxyTargetList => {
    const ret: ProxyTargetList = {};
    for (const [prefix, target] of list) {
        const httpsRE = /^https:\/\//;
        const isHttps = httpsRE.test(target);
        ret[prefix] = {
            target,
            changeOrigin: true,
            ws: true,
            // 重写 --- 替换前缀
            rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
            // https 需要设置 secure=false
            ...(isHttps ? { secure: false } : {})
        };
    }
    return ret;
};
