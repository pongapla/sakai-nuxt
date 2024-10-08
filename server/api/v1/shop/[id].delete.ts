import { readBody, defineEventHandler } from 'h3';
import { ShopDto } from '~/types/dtos/shop/shop.dto';
import Shop from '@/server/models/shops.model';
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const result = await Shops.update({ status: 'inactive' }, { where: { id } });
    return {
        status: 'success'
    };
});
