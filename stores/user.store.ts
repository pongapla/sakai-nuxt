import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiUser } from './../composables/useApiUser';
import { FetchingStatus } from '../types/enums/FetchingStatus';

export const useUserStore  = defineStore("user", () => {

    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
    const api = useApiUser();
    
   
    const createUser = async (user: FormData) => {
        try {
            
            const result = await api.createUser(user);
            return result;
            
        } catch (error) {
            
            console.error('Error creating user:', error);
            return error;
        }
    };


    const getUsers = async (start: string,limit: string) => {
        try {

            const result = await api.getUsers(start,limit);
            return result;

        } catch (error) {

            return error;

        } finally {
            FetchingStatus.success;
        }
    };

    const updateUser = async (user: FormData) => {
        
        try {

            const result = await api.updateUser(user);
            return result;

        } catch (error) {
            return error;
        } finally {
            
        }
    }

    const deleteUser = async (id: string) => {

        try {
            const result = await api.deleteUser(id);
            return result;
        } catch (error) {
            return error;
        } finally {

        }

    }

    return {

        fetchingStatus,
        createUser,
        getUsers,
        updateUser,
        deleteUser,
    };

});
    