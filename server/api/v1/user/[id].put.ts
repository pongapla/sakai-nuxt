import User from '@/server/models/user.model';
import { defineEventHandler, readBody, createError } from 'h3';
import { uploadImage } from '~/server/services/upload-file-service';
import { FormDataItem } from '~/types/types/user.type';

export default defineEventHandler(async (event) => {
    try {

        const formData: FormDataItem[] = await readBody(event); 
        const file = formData?.find((x) => x.name === 'file');
        const bodyRow = formData?.find((x) => x.name === 'body');
        if (!bodyRow) return { status: 'No data found', body: 'body is required' };
        const body = bodyRow ? JSON.parse(bodyRow.data.toString()) : null;
        const id = body.id;
        const result = await User.update(body, {
            where: {
                id
            }
        });
        // ตรวจสอบเรี่องรูปอีกที
        // if (file) {
        //     uploadIMage(file, { id: id, ...result });
        // }
        return {
            status: 'success',
            data: result
        };
    } catch (error: any) {
        return {
            messge: 'Error update User : ' + error.Message
        };
    }
});
