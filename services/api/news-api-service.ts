import { useFetcher } from '../../composables/useFetcher';
import { server, apiUrl } from '../../utils/constants';

const { fetch } = useFetcher();
export const getNews = async (start: string, limit: string) => {
    try {
        const result = await fetch(`${server.NEWS_URL}?start=${start}&limit=${limit}`);
        return result;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const getNewsById = async (id: string) => {
    try {
        const result = await fetch(`${server.NEWS_URL}/${id}`);
        return result;
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        throw error;
    }
};

export const createNews = async (news: FormData) => {
    try {
        const result = await fetch(`${server.NEWS_URL}`, {
            method: 'POST',
            body: news,
        });
        return result;
    } catch (error) {
        console.error('Error creating news:', error);
        throw error;
    }
}

export const updateNews = async (news: FormData) => {
    try {
        const result = await fetch(`${server.NEWS_URL}`, {
            method: 'PUT',
            body: news,
        });
        return result;
    } catch (error) {
        console.error('Error updating news:', error);
        throw error;
    }
} 

expport const daleteNews = async (id: string) => {
    try {
        const result = await fetch(`${server.NEWS_URL}/${id}`, {
            method: 'DELETE',
        });
        return result;
    } catch (error) {
        console.error('Error deleting news:', error);
        throw error;
    }
}