import { useFetcher } from '~/composables/useFetcher';
import { server, apiUrl } from '~/utils/constants';
import { UserDto } from '~/types/dtos/dtos/user/user.dot';

const { fetch } = useFetcher();

export const getUser = async () => {
    try {
        const result = await fetch(server.USER_URL);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getUserById = async () => {
    try {
        const respons = await fetch(`${server.USER_URL}/${id}`);

        if (!respons.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const createUser = async (user: UserDto) => {
    try {
        const response = await fetch(server.USER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id: string, user: UserDto) => {
    try {
        const result = await fetch(`${server.USER_URL}/${id}`, {
            method: 'PUT',
            herders: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        const result = await fetch(`${server.USER_URL}/${id}`, {
            method: 'DELETE',
            herders: {
                'Content-Type': 'application/json'
            }
        });
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};
