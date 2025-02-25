
import dbInstance  from '@/server/db_instance';
import Category  from '@/server/models/category.model';
import Language from '@/server/models/language.model';
import  CategoryLanguage  from '@/server/models/category_language.model';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';


export default defineEventHandler(async (event) => {
    const t = await dbInstance.transaction();
    try {
      
        const formData = await readMultipartFormData(event);
        const bodyRow = formData?.find(item => item.name === 'body');
        if (!bodyRow) return { result: 'No data found', data: 'body is required' };
        const body = bodyRow?.data ? JSON.parse(bodyRow.data.toString()) : null;
        if (!body) return { result: 'No data found', data: 'body is required' };
        
        const result = await Category.create({
            group: body.title,
        }, { transaction: t });
        
        const res = await CategoryLanguage.create({
            category_id: result.id,
            language_id: body.lang_id,
            title: body.title
        }, { transaction: t });

        await t.commit();

        const start =  '0';
        const limit =  '10';
        const startNum = parseInt(start);
        const limitNum = parseInt(limit);
        
        const count = await Category.count();

        const result1 = await Category.findAll({
            offset: startNum,
            limit: limitNum,
            include: [
                {
                    model: CategoryLanguage,
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

        const formattedResult = result1.map((category: any) => {
            const titles = category.Category_Languages.map((categoryLanguage: any) => categoryLanguage.title);
            const languages = category.Category_Languages.map((categoryLanguage: any) => categoryLanguage.Language.lang_flag);
            
            return {
                group: category.group,
                title: titles.join(', '),
                languageList: languages,
                languageTitles: titles,
            };
        });

        return {
            status: 'success',
            data: formattedResult,
            totalCount: count
        };

    } catch (error: any) {
        await t.rollback();
        return { 
            status: 500, 
            message: 'Internal Server Error: ' + (error.message || error) 
        };
    }
});

