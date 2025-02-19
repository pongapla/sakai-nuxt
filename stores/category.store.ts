import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiCategory } from './../composables/useApiCategory';
import { FetchingStatus } from '../types/enums/FetchingStatus';

export const  useCategoriesStore =  defineStore("category", () => {

    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
    const api = useApiCategory();

    const createCategory = async (category: FormData) => {
        try {
            
            const resoult = await api.createCategory(category);
            return resoult;
            
        } catch (error) {
            
            console.error('Error creating team:', error);
            return error;
        }
    };

    const getCategories = async (start: string,limit: string) => {
        try {
           
            const result = await api.getCategories(start,limit);
            return result;

        } catch (error) {

            return error;

        } finally {
            FetchingStatus.success;
        }
    };

    const updateCategory = async (user: FormData) => {
        
        try {

            const result = await api.updateCategory(user);
            return result;

        } catch (error) {
            return error;
        } finally {
            
        }
    }

    const deleteCategory = async (id: string) => {

        try {
            const result = await api.deleteCategory(id);
            return result;
        } catch (error) {
            return error;
        } finally {

        }

    }

    return {

        fetchingStatus,
        createCategory,
        getCategories,
        updateCategory,
        deleteCategory
    };

});