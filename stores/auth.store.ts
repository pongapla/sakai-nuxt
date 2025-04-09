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
    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
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
            fetchingStatus.value = FetchingStatus.fetching;
            await new Promise((resolve) => setTimeout(resolve, 100));
            const data = await api.login(loginDto);

            if (data.status === 'success') {
                token.value = 'DUMP TOKEN';
                userName.value = data.data.userName;
                fetchingStatus.value = FetchingStatus.success;
                session.isLoggedIn = true;
            } else {
                console.log('step 3.1 else');
                session.isLoggedIn = false;
                fetchingStatus.value = FetchingStatus.failed;
            }

            return data;
        } catch (error) {
            fetchingStatus.value = FetchingStatus.failed;
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

    const isLoading = () => fetchingStatus.value === FetchingStatus.fetching;

    return { session, login, logout, isLoading, restoreSession };
});

export default useAuthStore;
