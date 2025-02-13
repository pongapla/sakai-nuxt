import path from 'path';
import * as fs from 'fs';
import News from '@/server/models/news_language.model';
import User from '@/server/models/user.model';

export const uploadImage = async (file: any, doc: any, urlPath: any, modelName: string) => {
    
    if (file.filename != null) {

        var fileExtention = file.filename.split('.').pop();
        doc.image = `${doc.id}.${fileExtention}`;
        
        var newpath =
            path.resolve(path.resolve() + "/public/images/users") +
            "/" +
            doc.image;

        console.log(newpath);
        if (fs.existsSync(newpath)) {
            fs.unlinkSync(newpath);
        }

        
        fs.writeFileSync(newpath, file.data);

       
        let model = null;

        if (modelName === "News") {
            model = News;
        } else if (modelName === "User") {
            model = User;
        } else {
            throw new Error("Unknown model name"); 
        }
        
        let result = await model.update({ picture: doc.image }, { where: { id: doc.id } });
        console.log(result);
        return result;
    }
};
