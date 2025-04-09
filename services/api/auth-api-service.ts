import { useFetcher } from '../../composables/useFetcher';
import { server, apiUrl } from '../../utils/constants';
import type { TLogin } from '../../types/login/login.type';
import type { LoginDto } from '../../types/dtos/login.dto';

const { fetch } = useFetcher();

export const login = async (loginDto: LoginDto) => {
    try {
        const result = await fetch(`${server.LOGIN_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDto)
        });

        return result;
    } catch (error: any) {
        console.error('Error creating user:', error);
        throw error;
    }
};
