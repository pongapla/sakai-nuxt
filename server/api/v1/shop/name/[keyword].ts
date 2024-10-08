import { defineEventHandler } from 'h3';
import { Op } from 'sequelize';
import Shop from '~/server/models/shops.model';
export default defineEventHandler(async (event) => {
    const keyword = getRouterParam(event, 'keyword');
    const keywordDecode = decodeURIComponent(keyword);
    console.log(keywordDecode);
    const result = await Shop.findAll({
        where: {
            latitude: {
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
