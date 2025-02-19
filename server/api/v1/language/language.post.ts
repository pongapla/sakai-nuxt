import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { Op } from 'sequelize';
import Language from '@/server/models/language.model';


export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event);
        const bodyRow = formData?.find((x) => x.name === 'body');
        if (!bodyRow) return { result: 'No data found', data: 'body is required' };
        const body = bodyRow ? JSON.parse(bodyRow?.data.toString()) : null;

        const langData = await Language.findOne({
            where: {
                [Op.or]: [
                    { lang_name: body.lang_name },
                ]
            }
        });

        if (langData) {
            throw createError({
                status: 409,
                message: 'Language name already exists'
            });
        }

        const result = await Language.create(body);

        return {

            status: 'success',
            data: result
            
        };

    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Internal Server Error', error: error };
    }
});
