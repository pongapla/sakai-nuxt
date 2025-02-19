import { getCategories, getCategoryById, createCategory,  updateCategory, deleteCategory } from '../services/api/category-api-service';

export const useApiCategory = () => {
    return {
        getCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory
    };
};
