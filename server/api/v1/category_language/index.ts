import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import CategoryLanguage from '@/server/models/category_language.model';

export default defineEventHandler(async (event) => {
    try {
        
        const result = await CategoryLanguage.findAll();
        return {
            status: 'success',
            data: result
        };
    } catch (error: any) {
        console.error(error);
        return { 
            status: 500, 
            message: 'Internal Server Error' + error.message };
    }
});
