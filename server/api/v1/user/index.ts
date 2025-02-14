import { defineEventHandler } from 'h3';
import User from '@/server/models/user.model';

export default defineEventHandler(async (event) => {
    
    try {
        
        const url = event.req.url || '';

        const queryParams = new URLSearchParams(url.split('?')[1]);

        const start = queryParams.get('start') || '0';
        const limit = queryParams.get('limit') || '10';

        const startNum = parseInt(start);
        const limitNum = parseInt(limit);

        if (isNaN(startNum) || isNaN(limitNum)) {
            throw new Error("Invalid start or limit value");
        }

        const { rows, count } = await User.findAndCountAll({
            limit: limitNum,
            offset: startNum,
        });
        

        return {

            status: 'success',
            data: rows,
            totalCount: count,
        };

    } catch (error) {

        console.log(error);
        return { status: 500, message: 'Internal Server Error', error };
        
    }
});
