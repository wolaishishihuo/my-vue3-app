export interface UserState {
    token: string;
    userInfo: {
        username: string;
        [Key: string]: any;
    };
}
export interface AuthState {
    routeName: string;
    authButtonList: {
        [key: string]: string[];
    };
    authMenuList: any[];
}
