import path from 'path';
import * as fs from 'fs';
import News from '@/server/models/news_language.model';
import User from '@/server/models/user.model';
import AdsLanguage from '@/server/models/ads_language.model';
import { createError } from 'h3';

export const uploadImage = async (file: any, id: any, urlPath: any, modelName: string) => {
    // ตรวจสอบว่ามีไฟล์หรือไม่
    if (file && file.filename != null) {
        const fileExtension = file.filename.split('.').pop();

        const imageName = `${id}.${fileExtension}`;

        // สร้างเส้นทางใหม่ที่จะเก็บไฟล์
        let uploadPath = '';
        if (modelName === 'News') {
            uploadPath = path.resolve(path.resolve() + urlPath) + '/' + imageName;
        } else if (modelName === 'User') {
            uploadPath = path.resolve(path.resolve() + urlPath) + '/' + imageName;
        } else if (modelName === 'Ads') {
            uploadPath = path.resolve(path.resolve() + urlPath) + '/' + imageName;
        } else {
            throw new Error('Unknown model name');
        }

        // ตรวจสอบว่าไฟล์มีอยู่แล้วหรือไม่ หากมีให้ลบไฟล์เก่า
        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }

        fs.writeFileSync(uploadPath, file.data);

        // ตรวจสอบว่าเป็นโมเดลไหนแล้วทำการอัปเดตข้อมูลในฐานข้อมูล
        let result = null;
        if (modelName === 'News') {
            result = await News.update({ cover_picture: imageName }, { where: { id: id } });
        } else if (modelName === 'User') {
            result = await User.update({ picture: imageName }, { where: { id: id } });
        } else if (modelName === 'Ads') {
            result = await AdsLanguage.update({ cover_picture: imageName }, { where: { id: id } });
        } else {
            throw new Error('Unknown model name');
        }

        // คืนค่าผลลัพธ์
        return result;
    }

    createError({ statusCode: 400, message: 'No file uploaded' });
};
