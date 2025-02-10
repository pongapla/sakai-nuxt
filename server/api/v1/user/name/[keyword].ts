import User from '@/server/models/user.model';
import { defineEventHandler, getRouterParam } from 'h3';
import { Op } from 'sequelize';
export default defineEventHandler(async (event) => {
    
    const keyword = getRouterParam(event, 'keyword');

    if (!keyword || typeof keyword !== 'string') {
        return {
            status: 'error',
            message: 'Keyword is required and must be a string'
        };
    }

    const keywordDecode = decodeURIComponent(keyword);
    const result = await User.findAll({
        where: {
            userName: {
                [Op.like]: `%${keywordDecode}%`
            }
        }
    });
    if (result) {
        return {
            status: 'success',
            data: result
        };
    } else {
        return {
            status: 'No data found'
        };
    }
});
