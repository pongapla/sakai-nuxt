import { useApi } from './../composables/useApi';
import { FetchingStatus } from '../types/enums/FetchingStatus';
import { TSession } from '../types/sessions/session.type';
import { LoginDto } from '../types/dtos/login.dto';
import { server } from '../utils/constants';
import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useCookie } from '#app';

export const useAuthStore = defineStore('auth', () => {
    const userName = useCookie(server.USERNAME);
    const token = useCookie(server.TOKEN_KEY);
    const session = reactive<TSession>({ isLoggedIn: false, userName: undefined });
    const router = useRouter();
    const api = useApi();

    const restoreSession = () => {
        if (!!token.value && !!userName.value) {
            session.isLoggedIn = true;
            session.userName = userName.value!;
        } else {
            session.isLoggedIn = false;
        }
    };

    const login = async (loginDto: LoginDto) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const data = await api.login(loginDto);

            if (data.status === 'success') {
                token.value = 'DUMP TOKEN';
                userName.value = data.data.userName;

                session.isLoggedIn = true;
            } else {
                session.isLoggedIn = false;
            }

            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        userName.value = null;
        token.value = null;
        session.isLoggedIn = false;
        session.userName = undefined;
        return await router.push('/auth/login');
    };

    return { session, login, logout, restoreSession };
});

export default useAuthStore;
