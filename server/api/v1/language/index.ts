import Language from '@/server/models/language.model';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const result = await Language.findAll();
        return {
            status: 'success',
            data: result
        };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Internal Server Error', error: error };
    }
});
