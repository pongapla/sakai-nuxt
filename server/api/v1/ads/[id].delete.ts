import dbInstance from '@/server/db_instance';
import Ads from '@/server/models/ads.model';
import AdsLanguage from '@/server/models/ads_language.model';
import Language from '@/server/models/language.model';
import { deleteFile } from '@/server/services/dele-file-service';
import { defineEventHandler, createError, readBody } from 'h3';


export default defineEventHandler(async (event) => {
    const t = await dbInstance.transaction();

    try {

        let status;
        const body = await readBody(event);
        if (!body) throw createError({ statusCode: 400, message: 'Invalid data' });

        if (body.newKey) {
            
            const adsLanguagesAll = await AdsLanguage.findAll({
                where: {
                    ads_id: body.adsID
                },
                transaction: t
            });
            
            adsLanguagesAll.forEach((adsLanguage: any) => {
                deleteFile(adsLanguage.cover_picture, 'Ads');
            });
            
            await AdsLanguage.destroy({
                where: { ads_id: body.adsID },
                transaction: t
            });
            
            await Ads.destroy({
                where: {
                    id: body.adsID
                },
                transaction: t
            });
            await t.commit();
            console.log('dele asd ok');console.log(body);
            status = 'del-ads';
        } else {
            const lang = await Language.findOne({
                where: {
                    lang_flag: body.lang
                }
            });

            if (!lang) {
                throw createError({ statusCode: 404, message: 'Language not found' });
            }

            await AdsLanguage.destroy({
                where: {
                    ads_id: body.adsID,
                    language_id: lang.id
                },
                transaction: t
            });

            await t.commit();

            const checkAdsLanguage = await AdsLanguage.findOne({
                where: {
                    ads_id: body.adsID
                }
            });

            await deleteFile(body.picture, 'Ads');

            if (!checkAdsLanguage) {
                await Ads.destroy({
                    where: { id: body.adsID }
                });

                status = 'del-ads-lang';
            } else {
                status = 'del-lang';
            }
        }

        return {
            status: status
        };
    } catch (error: any) {
        await t.rollback();
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
