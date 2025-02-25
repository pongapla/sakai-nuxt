import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiLanguage } from './../composables/useApiLanguage';
import { FetchingStatus } from '../types/enums/FetchingStatus';

export const  useApiLanguages =  defineStore("language", () => {
    const api = useApiLanguage();

    const createLanguage = async (category: FormData) => {
        try {
            
            // const resoult = await api.createCategory(category);
            // return resoult;
            
        } catch (error) {
            
            console.error('Error creating team:', error);
            return error;
        }
    };

    const getLanguages = async () => {
        try {
           
            const result = await api.getLanguages();
            return result;

        } catch (error) {

            return error;

        } finally {
            FetchingStatus.success;
        }
    };

    const updateLanguage = async (user: FormData) => {
        
        try {

            // const result = await api.updateCategory(user);
            // return result;

        } catch (error) {
            return error;
        } finally {
            
        }
    }

    const deleteLanguage = async (id: string) => {

        try {
            const result = await api.deleteCategory(id);
            return result;
        } catch (error) {
            return error;
        } finally {

        }

    }
    
    return {
        createLanguage,
        getLanguages,
        updateLanguage,
        deleteLanguage
    }
});