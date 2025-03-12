import dbInstance from '@/server/db_instance';
import Ads from '@/server/models/ads.model';
import Language from '@/server/models/language.model';
import AdsLanguage from '@/server/models/ads_language.model';
import { uploadImage } from '@/server/services/upload-file-service';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { Op, fn, col } from 'sequelize';

export default defineEventHandler(async (event) => {
    
    try {
        
        const formData = await readMultipartFormData(event);
        const file = formData?.find((item) => item.name === 'file');
        const bodyRow = formData?.find((item) => item.name === 'body');

        if (!bodyRow) throw createError({ statusCode: 400, message: 'Body is required' });
        const body = bodyRow?.data ? JSON.parse(bodyRow.data.toString()) : null;
        if (!body) throw createError({ statusCode: 400, message: 'Invalid data' });
        
        const lang = await Language.findOne({
            where: {
                lang_flag: body.adsLanguages.language.lang_flag
            }
        });
        
        const existingAdsLanguage = await AdsLanguage.findOne({
            where: {
                ads_id: body.id,
                language_id: lang.id
            }
        });
        
        if (!existingAdsLanguage) {
            throw createError({ statusCode: 400, message: 'Data not found in the system!.' });
        }
        
        const res = await Ads.update(
            {
                is_popup: body.is_popup,
                is_slide: body.is_slide,
                is_news_content: body.is_news_content,
                is_list: body.is_list,
                start_date: body.start_date,
                stop_date: body.stop_date
            },
            {
                where: {
                    id: body.id
                }
            }
        );
        
        const result = await AdsLanguage.update(
            {
                title: body.adsLanguages.title,
                detail: body.adsLanguages.detail,
                url: body.adsLanguages.url
            },
            {
                where: { ads_id: body.id, language_id: lang.id }
            }
        );

        if (file) {
            const urlPath = '/public/images/ads';
            const modelName = 'Ads';
            uploadImage(file, existingAdsLanguage.id, urlPath, modelName);
        }

        const count = await Ads.count();

        const formattedResult = await Ads.findOne({
            where: {
                id: body.id
            },
            attributes: ['id', [fn('DATE', col('start_date')), 'start_date'], [fn('DATE', col('stop_date')), 'stop_date'], 'is_popup', 'is_slide', 'is_news_content', 'is_list'],
            include: [
                {
                    model: AdsLanguage,
                    as: 'adsLanguages',
                    include: [
                        {
                            model: Language,
                            as: 'language',
                            attributes: ['lang_flag'],
                            required: true
                        }
                    ],
                    attributes: ['title', 'detail', 'cover_picture', 'url']
                }
            ],
            group: ['id', 'start_date', 'stop_date', 'is_popup', 'is_slide', 'is_news_content', 'is_list', 'adsLanguages.id'], // เพิ่มคอลัมน์เหล่านี้เข้าไปใน GROUP BY
            order: [['id', 'ASC']]
        });
        
        return {
            status: 'success',
            data: formattedResult,
            totalCount: count
        };
    } catch (error: any) {
        

        if (error.statusCode && error.message) {
            return {
                status: error.statusCode,
                message: error.message
            };
        } else {
            return {
                status: 500,
                message: 'Internal Server Error: ' + (error.message || error)
            };
        }
    }
});
