import { useFetcher } from '../../composables/useFetcher';
import { server } from '../../utils/constants';



const { fetch } = useFetcher();

export const getLanguages = async () => {
    try {
        
        const result = await fetch(server.LANGUAGE_URL);
        return result;

    } catch (error) {

        console.error('Error creating lanuaguage:', error);
        throw error;

    }

};

export const getLanguageById = async (id: any) => {

    try {

        const result = await fetch(`${server.LANGUAGE_URL}/${id}`);
        return result;

    } catch (error) {

        console.error('Error creating language:', error);
        throw error;

    }
};

export const createLanguage = async (language: FormData) => {
    
    try {
        
        const resoult = await fetch('language/language', {
            method: 'POST',
            body: language,
        });
        
            return resoult ;

    } catch (error) {
        
        console.error('Error creating language:', error);
        throw error;
    }
};



export const updateLanguage = async (language: FormData) => {

    try {

        const bodyString = language.get('body') as string;
        const jsonData = JSON.parse(bodyString);
        const id = jsonData.id;
        
        const result = await fetch(`${server.LANGUAGE_URL}/${id}`, {

            method: 'PUT',
            body: language

        });

        return result;
        
    } catch (error) {

        console.error('Error creating language:', error);
        throw error;

    }
};

export const deleteLanguage = async (id: string) => {

    try {
       
        const result = await fetch(`${server.LANGUAGE_URL}/${id}`, {

            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            
        });
        
        return result;

    } catch (error) {

        console.error('Error creating language:', error);
        throw error;

    }
    
};
