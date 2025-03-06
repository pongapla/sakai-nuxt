import dbInstance  from '@/server/db_instance';
import Category  from '@/server/models/category.model';
import Language from '@/server/models/language.model';
import CategoryLanguage  from '@/server/models/category_language.model';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';

export default defineEventHandler(async (event) => {

    try {
        
        var ID: number = 0;
        const formData = await readMultipartFormData(event);
        const bodyRow = formData?.find(item => item.name === 'body');
        if (!bodyRow) throw createError({ statusCode: 400, message: 'Body is required' });
        const body = bodyRow?.data ? JSON.parse(bodyRow.data.toString()) : null;
        if (!body) throw createError({ statusCode: 400, message: 'Invalid data' });
        
        const cate_id = await Category.findOne({
          where : {
              group: body.group
          }
        });
        
        if (!cate_id) {
          throw createError({ statusCode: 404, message: 'Category not found' });
        }
        
        ID = cate_id.id;
        const existingCategoryLanguage = await CategoryLanguage.findOne({
          where: {
            category_id: ID,
            language_id: 1
          }
        });
        
        if (!existingCategoryLanguage) {
          throw createError({ statusCode: 404, message: 'No category language found with these IDs' });
        } else {
          // ทำการอัปเดตข้อมูล 
          await CategoryLanguage.update(
            { title: body.title },
            {
              where: {
                category_id: ID,
                language_id: body.lang_id
              }
            });
        }
        
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
