/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
    let timeNow = new Date();
    let hours = timeNow.getHours();
    if (hours >= 6 && hours <= 10) return '早上好 ⛅';
    if (hours >= 10 && hours <= 14) return '中午好 🌞';
    if (hours >= 14 && hours <= 18) return '下午好 🌞';
    if (hours >= 18 && hours <= 24) return '晚上好 🌛';
    if (hours >= 0 && hours <= 6) return '凌晨好 🌛';
}

/**
 * @description 生成唯一ID
 * @param {String} prefix - 前缀
 * @returns {String}
 */
export const generateUniqueId = (prefix = 'modal'): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random}`;
};
