import { useFetcher } from '../../composables/useFetcher';
import { server } from '../../utils/constants';



const { fetch } = useFetcher();

export const getCategories = async (start: string, limit: string) => {
    try {
        
        const result = await fetch(`${server.CATEGORY_URL}?start=${start}&limit=${limit}`);
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }

};

export const getCategoryById = async (id: any) => {

    try {

        const result = await fetch(`${server.USER_URL}/${id}`);
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const createCategory = async (category: FormData) => {
    
    try {
        
        const resoult = await fetch('categories/categories', {
            method: 'POST',
            body: category,
        });
        
            return resoult ;

    } catch (error) {
        
        console.error('Error creating categories:', error);
        throw error;
    }
};



export const updateCategory = async (category: FormData) => {

    try {

        const bodyString = category.get('body') as string;
        const jsonData = JSON.parse(bodyString);
        const id = jsonData.id;
        
        const result = await fetch(`${server.CATEGORY_URL}/${id}`, {

            method: 'PUT',
            body: category

        });

        return result;
        
    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const deleteCategory = async (id: string) => {

    try {
       
        const result = await fetch(`${server.CATEGORY_URL}/${id}`, {

            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            
        });
        
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
    
};
