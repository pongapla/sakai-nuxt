import {getLanguages, getLanguageById, createLanguage,  updateLanguage, deleteLanguage } from '../services/api/language-api-service';

export const useApiLanguage = () => {
    return {
        getLanguages,
        getLanguageById,
        createLanguage,
        updateLanguage,
        deleteLanguage
    };
};
