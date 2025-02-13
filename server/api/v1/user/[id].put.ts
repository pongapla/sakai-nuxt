 import User from '@/server/models/user.model';
 import { defineEventHandler, readMultipartFormData } from 'h3';
 import { uploadImage } from '~/server/services/upload-file-service';

export default defineEventHandler(async (event: any) => {
    try {

        const formData = await readMultipartFormData(event);
        const file = formData?.find(item => item.name === 'file');
        const bodyRow = formData?.find(item => item.name === 'body');
        
        if (!bodyRow) {
            return { status: 'No data found', body: 'body is required' };
        }

        const body = JSON.parse(bodyRow.data.toString());
        const userId = body.id;

        const result = await User.update(body, {
            where: {
                id: userId
            }
        });

        const getUser = await User.findOne({
            where: {
                id: userId
            }
        });
          
        if (file) {
            const urlPath = '/public/images/users';
            const modelName = 'User';
            await uploadImage(file, getUser, urlPath, modelName); 
        }
        
        if(result > 0) {

            const updatedUser = await User.findOne({
                where: {
                    id: userId
                }
            });
            
            return {
                status: 'success',
                data: updatedUser
            };
        }
        
        
    } catch (error: any) {
        return {
            message: 'Error update User: ' + error.message
        };
    }
});
