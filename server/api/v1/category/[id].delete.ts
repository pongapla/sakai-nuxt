import dbInstance  from '@/server/db_instance';
import Category from '@/server/models/category.model';
import CategoryLanguage  from '@/server/models/category_language.model';
import Language from '@/server/models/language.model';
import { defineEventHandler, createError, readBody } from 'h3';


export default defineEventHandler(async (event) => {
  const t = await dbInstance.transaction();
  try {
   
    var c_id;
    var status;
    const body = await readBody(event)
    
    if (!body) throw createError({ statusCode: 400, message: 'Invalid data' });
    
    const cate = await Category.findOne({
      where: {
        group: body.group
      }
    });

    if (!cate) {
      throw createError({ statusCode: 404, message: 'Category not found' });
    }

    c_id = cate.id;

    if(body.newKey) {
      
      await Category.destroy({
        where: {
          id: c_id
        },
        transaction: t
       });

      status = 'del-cat'
    } else {
      
      const lang = await Language.findOne({
        where: {
          lang_flag: body.lang
        }
      })
      
      if (!lang) {
        throw createError({ statusCode: 404, message: 'Language not found' });
      }

      await CategoryLanguage.destroy({
        where: {
          category_id: cate.id,
          language_id: lang.id
        },
        transaction: t
      });
      
      status = 'del-lang'
    }

    await t.commit();

    return {
        status: status
    };
  } catch (error: any) {
    await t.rollback()
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
