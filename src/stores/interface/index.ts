import { User } from '@/api/interface';

export interface UserState {
    token: string;
    userInfo: User.UserInfo;
}
export interface AuthState {
    routeName: string;
    authButtonList: {
        [key: string]: string[];
    };
    authMenuList: any[];
    coursePortalList: any[];
    folderList: any[]
}
