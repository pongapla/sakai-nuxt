import path from 'path';
import * as fs from 'fs';
import News from '@/server/models/news_language.model';

export const uploadImage = async (file: any, doc: any, urlPath: any) => {
    if (file.filename != null) {
        var fileExtention = file.filename.split('.').pop();
        doc.image = `${doc.id}.${fileExtention}`;

        var newpath = path.resolve(path.resolve() + urlPath) + '/' + doc.image;

        if (fs.existsSync(newpath)) {
            fs.unlinkSync(newpath);
        }

        fs.writeFileSync(newpath, file.data);
        let result = News.update({ cover_picture: doc.image }, { where: { id: doc.id } });
        return result;
    }
};
