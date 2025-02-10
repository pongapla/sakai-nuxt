import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiUser } from './../composables/useApiUser';
import { FetchingStatus } from '../types/enums/FetchingStatus';
import { UserDto } from '../types/dtos/user/user.dot';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore("user", () => {

    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
    const api = useApiUser();
    const users = ref<UserDto[]>([]);

    // ฟังก์ชันการสร้าง User
    const createUser = async (user: FormData) => {
        try {
            // เรียก API เพื่อสร้างผู้ใช้
            const response = await api.createUser(user);
            const data = await response.json();
            if (data.success) {
                return data;
            } else {
                throw new Error('Failed to create user: ' + (data.message || 'Unknown error'));
            }
            
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // ส่ง error ต่อไป
        }
    };

    // ฟังก์ชันดึงข้อมูลผู้ใช้
    const getUsers = async () => {
        try {

            const result = await api.getUsers();
            users.value = result.data;
            fetchingStatus.value = FetchingStatus.success;
            return { users: result.data };

        } catch (error) {

            console.log(error);
            fetchingStatus.value = FetchingStatus.failed;

        }
    };

    return {
        createUser,
        getUsers,
        users,
        fetchingStatus,
    };
});
