import { defineStore } from 'pinia';
import { UserState } from '../interface';
import piniaPersistConfig from '../helper';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: 'Token',
        userInfo: {
            username: 'Jname_kw'
        }
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        }
    },
    persist: piniaPersistConfig('user')
});
