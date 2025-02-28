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
        const result = await fetch('category/category', {
            method: 'POST',
            body: category,
        });

        return result

    } catch (error: any) {
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

export const deleteCategory = async (data: any) => {

    try {
        
        const group = data.value.group || '';
        const lang = data.value.currentLang || '';
        const newKey = data.value.newKey || '';
        const result = await fetch(`${server.CATEGORY_URL}/1`, {

            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group: group,
                lang: lang,
                newKey: newKey
            })
            
        });
        
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
    
};
