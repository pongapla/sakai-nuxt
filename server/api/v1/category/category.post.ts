import Category from '@/server/models/category.model';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';

export default defineEventHandler(async (event) => {

    try {
        
        const formData = await readMultipartFormData(event);
        const bodyRow = formData?.find(item => item.name === 'body');
        if (!bodyRow) return { result: 'No data found', data: 'body is required' };
        const body = bodyRow ? JSON.parse(bodyRow?.data.toString()) : null;
        if (!body) return { result: 'No data found', data: 'body is required' };
    
        const result = await Category.create(body);
        return {
            status: result ? 'success' : 'found',
            data: result
        };

    } catch (error: any) {
        
        return { 
            status: 500, 
            message: 'Internal Server Error' + error.message 
        };
    }
});
