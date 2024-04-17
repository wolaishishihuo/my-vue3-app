/**
 * 将环境配置信息包装成ViteEnv格式的函数。
 * @param envConf 环境配置对象，键值对形式，其中键为环境变量名，值为环境变量的字符串值。
 * @returns 返回一个对象，其键为环境变量名，值为经过处理的环境变量值。处理规则如下：
 * - 字符串值中的`\n`会被替换为换行符。
 * - 字符串值如果是"true"或"false"，则会被转换为布尔值。
 * - 如果环境变量名是"VITE_PORT"，则其值会被转换为数字。
 * - 如果环境变量名是"VITE_PROXY"，则尝试将其值解析为JSON对象。
 */
export function wrapperEnv(envConf: Record<string, any>): ViteEnv {
    const ret: any = {};
    for (const envName of Object.keys(envConf)) {
        // 替换环境变量值中的换行符，并根据字符串值转换为布尔值或保持原样
        let realName = envConf[envName].replace(/\\n/g, '\n');
        realName = realName === 'true' ? true : realName === 'false' ? false : realName;

        // 如果环境变量名指定，进行特殊类型转换
        if (envName === 'VITE_PORT') realName = Number(realName);
        if (envName === 'VITE_PROXY') {
            try {
                // 尝试将环境变量值解析为JSON
                realName = JSON.parse(realName);
            } catch (error) {
                // 解析失败时，不做处理，保持原样
            }
        }
        ret[envName] = realName;
    }
    return ret;
}
