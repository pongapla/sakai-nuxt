import path from 'path';
import * as fs from 'fs';
import { createError } from 'h3';

/**
 * ฟังก์ชันนี้จะทำการลบไฟล์ที่ไม่จำเป็นในระบบ
 * @param fileName ชื่อไฟล์ที่จะลบ
 * @param modelName ชื่อโมเดลที่เกี่ยวข้องกับไฟล์นี้
 * @returns null ถ้าลบสำเร็จ หรือจะโยนข้อผิดพลาดถ้าลบไม่สำเร็จ
 */
export const deleteFile = async (fileName: string, modelName: string) => {
    console.log(fileName,modelName);
    if (!fileName) {
        throw createError({ statusCode: 400, message: 'No file name provided' });
    }
    
    let filePath = '';
    let urlPath = '';
    // สร้างเส้นทางไฟล์ตามชื่อโมเดล
    if (modelName === 'News') {
        urlPath = 'News';
        filePath = path.resolve(path.resolve() + urlPath) + '/' + fileName;
    } else if (modelName === 'User') {
        urlPath = '/public/images/users';
        filePath = path.resolve(path.resolve() + urlPath) + '/' + fileName;
    } else if (modelName === 'Ads') {
        urlPath = '/public/images/ads';
        filePath = path.resolve(path.resolve() + urlPath) + '/' + fileName;
        
    } else {
        throw createError({ statusCode: 400, message: 'Unknown model name' });
    }

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if (fs.existsSync(filePath)) {
        // ลบไฟล์
        fs.unlinkSync(filePath);
        console.log(`File ${fileName} deleted successfully.`);
    } else {
        throw createError({ statusCode: 404, message: 'File not found' });
    }
};
