/**
 * 将环境配置信息包装成ViteEnv格式的函数。
 * @param envConf 环境配置对象，键值对形式，其中键为环境变量名，值为环境变量的字符串值。
 * @returns 返回一个对象，其键为环境变量名，值为经过处理的环境变量值。处理规则如下：
 * - 字符串值中的`\n`会被替换为换行符。
 * - 字符串值如果是"true"或"false"，则会被转换为布尔值。
 * - 如果环境变量名是"VITE_PORT"，则其值会被转换为数字。
 * - 如果环境变量名是"VITE_PROXY"，则尝试将其值解析为JSON对象。
 */
export const wrapperEnv = (envConf: Record<string, string>): Record<string, any> => {
    const ret: Record<string, any> = {};

    for (const envName of Object.keys(envConf)) {
        let realName = envConf[envName].replace(/\\n/g, '\n');

        // 处理布尔值
        if (realName === 'true') {
            ret[envName] = true;
            continue;
        }
        if (realName === 'false') {
            ret[envName] = false;
            continue;
        }

        // 处理端口号
        if (envName === 'VITE_PORT') {
            ret[envName] = Number(realName);
            continue;
        }

        // 处理代理配置
        if (envName === 'VITE_PROXY' && realName) {
            try {
                ret[envName] = JSON.parse(realName.replace(/'/g, '"'));
            } catch (error) {
                ret[envName] = [];
            }
            continue;
        }

        // 默认字符串处理
        ret[envName] = realName;
        process.env[envName] = realName;
    }
    return ret;
};
