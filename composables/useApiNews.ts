import { getNews, getNewsById, createNews, updateNews, deleteNews } from '../services/api/news-api-service';

export const useApiNews = () => {
    return {
        getNews,
        getNewsById,
        createNews,
        updateNews,
        deleteNews
    };
};
