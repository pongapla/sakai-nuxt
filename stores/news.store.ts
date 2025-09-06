import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useNewsAPI } from './../composables/useApiNews';
import { FetchingStatus } from '../types/enums/FetchingStatus';

export const useNewsStore = defineStore('news', () => {
    const fetchingStatus = ref('init');
    const api = useNewsAPI();

    const createNews = async (news: FormData) => {
        try {
            const result = await api.createNews(news);
            return result;
        } catch (error) {
            console.error('Error creating news:', error);
            return error;
        }
    };

    const getNews = async (start: string, limit: string) => {
        try {
            const result = await api.getNews(start, limit);
            return result;
        } catch (error) {
            console.error('Error fetching news:', error);
            return error;
        } finally {
            fetchingStatus.value = 'success';
        }
    };

    const updateNews = async (news: FormData) => {
        try {
            const result = await api.updateNews(news);
            return result;
        } catch (error) {
            console.error('Error updating news:', error);
            return error;
        }
    };

    const deleteNews = async (id: string) => {
        try {
            const result = await api.deleteNews(id);
            return result;
        } catch (error) {
            console.error('Error deleting news:', error);
            return error;
        }
    };

    return {
        fetchingStatus,
        createNews,
        getNews,
        updateNews,
        deleteNews
    };
}