
import dbInstance  from '@/server/db_instance';
import Category  from '@/server/models/category.model';
import Language from '@/server/models/language.model';
import CategoryLanguage  from '@/server/models/category_language.model';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';


export default defineEventHandler(async (event) => {
    const t = await dbInstance.transaction();
    try {
        let ID: number = 0;
        const formData = await readMultipartFormData(event);
        const bodyRow = formData?.find(item => item.name === 'body');
        if (!bodyRow) throw createError({ statusCode: 400, message: 'Body is required' });
        const body = bodyRow?.data ? JSON.parse(bodyRow.data.toString()) : null;
        if (!body) throw createError({ statusCode: 400, message: 'Invalid data' });

        if(body.group) {
            
            const result = await Category.findOne({
                where : {
                    group: body.group
                }
            });

           
            const isDuplicate = await CategoryLanguage.findOne({
                where: {
                    category_id: result.id,
                    language_id: body.lang_id
                }
            });

            if(isDuplicate){
              throw createError({ statusCode: 400, message: 'Category with this language already exists!'});
            }

            
            await CategoryLanguage.create({
              category_id: result.id,
              language_id: body.lang_id,
              title: body.title
            }, { transaction: t });
            
            ID = result.id;

        } else {
            
            const isDupicate = await Category.findOne({
              where: {
                group: body.title
              }
            });

            if(isDupicate) {
              throw createError({
                statusCode: 400,
                message: 'Category already exists!'
              });
            } 

            const result = await Category.create({
              group: body.title,
            }, { transaction: t });

           
            await CategoryLanguage.create({
                category_id: result.id,
                language_id: body.lang_id,
                title: body.title
            }, { transaction: t });
            ID = result.id;
        }

        await t.commit();

       
        const count = await Category.count();
        
        const result1 = await Category.findOne({
          where: {
            id: ID,
          },
          include: [
            {
              model: CategoryLanguage,
              where: { category_id: ID },
              include: [
                {
                  model: Language,
                  attributes: ['lang_flag', 'lang_icon'] 
                }
              ]
            }
          ],
          attributes: ['group'],
        });

        if (!result1) {
          throw createError({ statusCode: 404, message: 'Category not found' });
        }
        
        const formattedResult = {
            group: result1.group,
            title: result1.Category_Languages.map((categoryLanguage: any) => categoryLanguage.title).join(', '),
            languageList: result1.Category_Languages.map((categoryLanguage: any) => categoryLanguage.Language.lang_flag),
            languageTitles: result1.Category_Languages.map((categoryLanguage: any) => categoryLanguage.title),
        };

        return {
            status: 'success',
            data: formattedResult,
            totalCount: count
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

