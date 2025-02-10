import Category from '@/server/models/category.model';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const formData = await readBody(event);
        const bodyRow = formData.find((x: any) => x.name === 'body');
        if (!bodyRow) return { result: 'No data found', data: 'body is required' };
        const body = bodyRow ? JSON.parse(bodyRow?.data.toString()) : null;
        if (!body) return { result: 'No data found', data: 'body is required' };
        const result = await Category.create(body);
        return {
            status: result ? 'success' : 'found',
            data: result
        };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Internal Server Error', error };
    }
});
