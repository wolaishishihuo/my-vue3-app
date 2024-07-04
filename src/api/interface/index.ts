export namespace Login {
    export interface Res {
        token: string;
        userId: string;
    }
}
export namespace Register {
    export interface Res {
        token: string;
        userId: string;
    }
}
export namespace User {
    export interface UserInfo {
        userId: string;
        avatar: string;
        username: string;
        secret: string;
        email: string;
        mobile: string;
    }
}
export namespace Captcha {
    export interface Res {
        key: string;
        svg: string;
    }
}
