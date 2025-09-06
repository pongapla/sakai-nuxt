import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiCategory } from './../composables/useApiCategory';
import { FetchingStatus } from '../types/enums/FetchingStatus';

export const useCategoriesStore = defineStore('category', () => {
    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
    const api = useApiCategory();

    const createCategory = async (category: FormData) => {
        try {
            const result = await api.createCategory(category);
            return result;
        } catch (error) {
            console.error('Error creating team:', error);
            return error;
        }
    };

    const createCategoryLanguage = async (category: FormData) => {
        try {
            const result = await api.createCategory(category);
            return result;
        } catch (error) {
            console.error('Error creating team:', error);
            return error;
        }
    };

    const getCategories = async (start: string, limit: string) => {
        try {
            const result = await api.getCategories(start, limit);
            return result;
        } catch (error) {
            return error;
        } finally {
        }
    };

    const updateCategoryLanguage = async (category: FormData) => {
        try {
            const result = await api.updateCategory(category);
            return result;
        } catch (error) {
            return error;
        } finally {
        }
    };

    const deleteCategory = async (data: any) => {
        try {
            const result = await api.deleteCategory(data);
            return result;
        } catch (error) {
            return error;
        } finally {
        }
    };

    return {
        fetchingStatus,
        createCategory,
        createCategoryLanguage,
        getCategories,
        updateCategoryLanguage,
        deleteCategory
    };
});
