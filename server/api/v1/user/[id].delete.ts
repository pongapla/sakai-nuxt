import {  defineEventHandler } from 'h3';
import User from '@/server/models/user.model';
export default defineEventHandler(async (event) => {

    if (event.context.params && event.context.params.id) {
        const id = event.context.params.id;
        console.log('User ID:', id);
        
        
        const result = await User.update({ status: 'InActive' }, { where: { id } });
        
        if (result[0] > 0) {
            return {
                status: 'success',
                message: 'User status delete successfully'
            };
        } else {
            return {
                status: 'error',
                message: 'User not found or status already inactive'
            };
        }
    } else {
        return {
            status: 'error',
            message: 'User ID is missing or invalid'
        };
    }
   
});
