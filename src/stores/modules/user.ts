import { defineStore } from 'pinia';
import { UserState } from '../interface';
import piniaPersistConfig from '../helper';
import { getUserInfo } from '@/api/user';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: '',
        userInfo: {
            username: 'Jname_kw',
            userId: '',
            avatar: '',
            secret: '',
            email: '',
            mobile: ''
        }
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUserId(userId: string) {
            this.userInfo.userId = userId;
        },

        async getUserInfo() {
            // const { data } = await getUserInfo();
            const data = {
                username: 'admin',
                userId: 'admin',
                avatar: '',
                secret: '',
                email: '',
                mobile: ''
            };
            Object.assign(this.userInfo, data);
        }
    },
    persist: piniaPersistConfig('user')
});
