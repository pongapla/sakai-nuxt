import Category from '@/server/models/category.model';
import CategoryLanguage from '@/server/models/category_language.model';
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
        console.error(error);
        return { status: 'error', message: 'Internal Server Error', error: error.message };
    }
});
