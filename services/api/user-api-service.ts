import { useFetcher } from '../../composables/useFetcher';
import { server, apiUrl } from '../../utils/constants';
import { UserDto } from '../../types/dtos/user/user.dot';


const { fetch } = useFetcher();

export const getUsers = async () => {
    try {

        const result = await fetch(server.USER_URL);
        
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }

};

export const getUserById = async (id) => {

    try {

        const respons = await fetch(`${server.USER_URL}/${id}`);

        if (!respons.ok) {

            const errorData = await respons.json();
            throw new Error(errorData.message || 'Something went wrong');

        }

        const result = await respons.json();
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const createUser = async (user: FormData) => {
    try {
        // ใช้ URL ที่ถูกต้อง เช่น http://localhost:3000/api/v1/user/user
        const response = await fetch('user/user', {
            method: 'POST',
            body: user,
        });
        console.log(response);
        const data = await response;
        if (data.success) {
            console.log(data);console.log('page user-api-service', data);
            return data;
        } else {
            throw new Error('Failed to create user: ' + (data.message || 'Unknown error'));
        }

    } catch (error) {
        // จับข้อผิดพลาดและแสดงใน console
        console.error('Error creating user:', error);
        throw error; // ส่ง error ต่อไป
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
