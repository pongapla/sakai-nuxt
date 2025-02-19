import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { Op } from 'sequelize';
import Language from '@/server/models/language.model';

export default defineEventHandler(async (event: any) => {
   try {

       const formData = await readMultipartFormData(event);
       const file = formData?.find(item => item.name === 'file');
       const bodyRow = formData?.find(item => item.name === 'body');
       
       if (!bodyRow) {
           return { status: 'No data found', body: 'body is required' };
       }

       const body = JSON.parse(bodyRow.data.toString());
       const langId = body.id;

       const result = await Language.update(body, {
           where: {
               id: langId
           }
       });

       const getLang = await Language.findOne({
           where: {
               id: langId
           }
       });
         
       
       
       if(result > 0) {

           const updatedLang = await Language.findOne({
               where: {
                   id: langId
               }
           });
           
           return {
               status: 'success',
               data: updatedLang
           };
       }
       
       
   } catch (error: any) {
       return {
          status: '500',
          message: 'Internal Server Error: ' + error.message
       };
   }
});
