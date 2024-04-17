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
        setToken() {
            this.token = 'Token';
        },
        setUserInfo() {
            this.userInfo = {
                username: 'Jname_kw'
            };
        }
    },
    persist: piniaPersistConfig('user')
});
