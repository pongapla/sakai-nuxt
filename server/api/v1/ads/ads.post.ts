import dbInstance  from '@/server/db_instance';
import Ads from '@/server/models/ads.model';
import Language from '@/server/models/language.model';
import AdsLanguage from '@/server/models/ads_language.model';
import { uploadImage } from '@/server/services/upload-file-service';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { Op, fn, col } from 'sequelize';

export default defineEventHandler(async (event) => {
    const t = await dbInstance.transaction();
    try {
        let ID: number = 0;
        let lang_id: number = 0;
        const formData = await readMultipartFormData(event);
        const file = formData?.find((item) => item.name === 'file');
        const bodyRow = formData?.find((item) => item.name === 'body');
        
        if (!bodyRow) throw createError({ statusCode: 400, message: 'Body is required' });
        const body = bodyRow?.data ? JSON.parse(bodyRow.data.toString()) : null;
        if (!body) throw createError({ statusCode: 400, message: 'Invalid data' });
       
        const  lang = await Language.findOne({
          where: {
            lang_flag: body.adsLanguages.language.lang_flag
          }
        });
       
        if (body.id) {
          
          const isDuplicate = await AdsLanguage.findOne({
              where: {
                  ads_id: body.id,
                  language_id: lang.id
              }
          });
         
          if(isDuplicate){
            throw createError({ statusCode: 400, message: 'Ads with this language already exists!'});
          }
          
          const res = await AdsLanguage.create({
            ads_id: body.id,
            language_id: lang.id,
            title: body.adsLanguages.title,
            detail: body.adsLanguages.detail,
            cover_picture: body.adsLanguages.cover_picture,
            url: body.adsLanguages.url
          }, { transaction: t });
          
          ID = body.id;
          lang_id = res.id;
        } else {
          
          const result = await Ads.create({
            start_date: body.start_date,
            stop_date: body.stop_date,
            is_popup: body.is_popup[0],
            is_slide: body.is_slide[0],
            is_list: body.is_list[0],
            is_news_content: body.is_news_content[0]
          }, { transaction: t });
          
          const res = await AdsLanguage.create({
            ads_id: result.id,
            language_id: lang.id,
            title: body.adsLanguages.title,
            detail: body.adsLanguages.detail,
            cover_picture: body.adsLanguages.cover_picture,
            url: body.adsLanguages.url
          }, { transaction: t });
          
          if (!result || !result.id) {
            createError({ statusCode: 400, message: 'Failed to create the ad, ID is undefined'});
          }

          ID = result.id;
          lang_id = res.id;
        }
        
        if (file) {
          const urlPath = '/public/images/ads';
          const modelName = 'Ads';
          uploadImage(file, lang_id, urlPath, modelName);
        }
        await t.commit();

        const count = await Ads.count();
       
        const formattedResult = await Ads.findOne({
          where: {
              id: ID
          },
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
          group: ['id', 'start_date', 'stop_date', 'is_popup', 'is_slide', 'is_news_content', 'is_list', 'adsLanguages.id'],  // เพิ่มคอลัมน์เหล่านี้เข้าไปใน GROUP BY
          order: [['id', 'ASC']],
      });
      
        return {
          status: 'success',
          data: formattedResult,
          totalCount: count,
      };

    } catch (error: any) {
      if (t.finished !== 'commit') {
        await t.rollback();
      }

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
