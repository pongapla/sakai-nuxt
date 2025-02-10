import { Password } from './../../../../.nuxt/components.d';
import { defineEventHandler, readBody, createError } from 'h3';
import bcrypt from 'bcryptjs';
import User from '~/server/models/user.model';
export default defineEventHandler(async (event) => {
    
    const body = await readBody(event);

    const userData = await User.findOne({

        where: {
            userName: body.userName
        }

    });
    // ครั้งแรกที่เพิ่ม User
    //console.log(await bcrypt.hash(body.password, 10));
    
    if (body.userName !== userData?.get('userName')) {

        throw createError({
            status: 401,
            message: 'Invalid userName or Password'
        });

    }

    const passwordMatch = await bcrypt.compare(body.password, userData?.get('password'));
  
    if (!passwordMatch) {

        throw createError({
            status: 401,
            message: 'Invalid Username or Password'
        });

    }
    return {
        
        status: 'success',
        data: userData
    };

});
