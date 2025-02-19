import Category from '@/server/models/category.model';
import CategoryLanguage from '@/server/models/category_language.model';
import Language from '@/server/models/language.model';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';

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
        
        const count = await Category.count();
        
        const result = await Category.findAll({
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
        
        const formattedResult = result.map((category: any) => {
            return {
                group: category.group,
                languages: category.Category_Languages.map((categoryLanguage: any) => {
                    return {
                        name: categoryLanguage.title,
                        flag: categoryLanguage.Language.lang_flag,
                        icon: categoryLanguage.Language.lang_icon
                    };
                })
            };
        });

        return {
            status: 'success',
            data: formattedResult,
            totalCount: count
        };

    } catch (error: any) {
        console.error(error);
        return { status: 500, message: 'Internal Server Error', error: error.message };
    }
});
