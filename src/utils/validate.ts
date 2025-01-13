/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
    const regexp = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
    if (value === '') callback('请输入手机号码');
    if (!regexp.test(value)) {
        callback(new Error('请输入正确的手机号码'));
    } else {
        return callback();
    }
}

/**
 *  @rule 邮箱
 */
export function checkEmail(rule: any, value: any, callback: any) {
    const regexp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (value === '') callback('请输入邮箱!');

    if (!regexp.test(value)) {
        callback(new Error('请输入正确的邮箱格式'));
    } else {
        return callback();
    }
}
