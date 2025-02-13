import User from '@/server/models/user.model';
import { uploadImage } from '~/server/services/upload-file-service';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

export default defineEventHandler(async (event) => {
    
    try {

        const formData = await readMultipartFormData(event);
        const file = formData?.find(item => item.name === 'file');
        const bodyRow = formData?.find(item => item.name === 'body');
       
        if (!bodyRow) return { result: 'No data found', data: 'body is required' };
        const body = bodyRow ? JSON.parse(bodyRow?.data.toString()) : null;
        if (!body) return { result: 'No data found', data: 'body is required' };
        body.password = await bcrypt.hash(body.password, 10);
        
        const userData = await User.findOne({
            where: {
                [Op.or]: [
                    { userName: body.userName },
                    { email: body.email }
                ]
            }
        });
       
        if (userData) {
            throw createError({
                status: 409,
                message: 'Username already exists'
            });
        }
        delete body.id;
        const result = await User.create(body);
        console.log(result);
        if (file) {
            const urlPath = '/public/images/users';
            const modelName = 'User';
            uploadImage(file, result, urlPath, modelName);
        }
        console.log(result); console.log('>>>>>');
        return {

            status: 'success',
            data: result

        };

    } catch (error) {

        return { status: 500, message: 'Internal Server Error', error };

    }
    
});
