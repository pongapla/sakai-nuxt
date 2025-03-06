
import { fn, col } from 'sequelize';
import Ads from '@/server/models/ads.model';
import AdsLanguage from '@/server/models/ads_language.model';
import Language from '@/server/models/language.model';
import { defineEventHandler } from 'h3';


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

        const offset = startNum;
        const paginationLimit = limitNum;
        const count = await Ads.count();

        const formattedResult = await Ads.findAll({
            attributes: [
                'id',
                [fn('DATE', col('start_date')), 'start_date'],
                [fn('DATE', col('stop_date')), 'stop_date'],
                'is_popup',
                'is_slide',
                'is_news_content',
                'is_list'
            ],
            include: [{
                model: AdsLanguage,
                as: 'adsLanguages',
                include: [{
                    model: Language,
                    as: 'language',
                    attributes: ['lang_flag'],
                    required: true
                }],
                
                attributes: ['title', 'detail', 'cover_picture', 'url'] 
            }],
            limit: paginationLimit,
            offset: offset,
            group: ['id'],
            order: [['id', 'ASC']],
        });

        return {
            status: 'success',
            data: formattedResult,
            totalCount: count,
        };

    } catch (error: any) {
        console.error(error);
        return { status: 500, message: 'Internal Server Error', error: error.message };
    }
});
