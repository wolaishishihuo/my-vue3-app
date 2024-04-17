export interface UserState {
    token: string;
    userInfo: {
        username: string;
        [Key: string]: any;
    };
}
