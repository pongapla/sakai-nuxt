import { useApi } from './../composables/useApi';
import { useAuthStore } from './auth.store';
import { FetchingStatus } from '~/types/enums/FetchingStatus';
import { TSession } from '~/types/sessions/session.type';
import { LoginDto } from '~/types/dtos/login.dto';

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
            const { result, data } = await api.login(loginDto);
            
            if (result === 'ok') {

                token.value = 'DUMP TOKEN';
                userName.value = data.userName;
                fetchingStatus.value = FetchingStatus.success;
                session.isLoggedIn = true;

            } else {

                session.isLoggedIn = false;
                fetchingStatus.value = FetchingStatus.failed;

            }

            window.open('/', '_self');

        } catch (error) {

            fetchingStatus.value = FetchingStatus.failed;
            console.error(error);

        }
    };

    const logout = async () => {
        userName.value = null;
        token.value = null;
        session.isLoggedIn = false;
        session.userName = undefined;
        return await navigateTo('/auth/login');
    };

    const isLoading = () => fetchingStatus.value === FetchingStatus.fetching;

    return { session, login, logout, isLoading, restoreSession }; 
});

export default useAuthStore;
