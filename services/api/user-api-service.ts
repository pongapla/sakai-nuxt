import { useFetcher } from '../../composables/useFetcher';
import { server, apiUrl } from '../../utils/constants';



const { fetch } = useFetcher();

export const getUsers = async () => {
    try {
        
        const resoult = await fetch(server.USER_URL);
        
        return resoult;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }

};

export const getUserById = async (id) => {

    try {

        const result = await fetch(`${server.USER_URL}/${id}`);
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const createUser = async (user: FormData) => {
    
    try {
        
        const resoult = await fetch('user/user', {
            method: 'POST',
            body: user,
        });
        
            return resoult ;

    } catch (error) {
        
        console.error('Error creating user:', error);
        throw error;
    }
};



export const updateUser = async (user: FormData) => {

    try {

        const bodyString = user.get('body') as string;
        const jsonData = JSON.parse(bodyString);
        const id = jsonData.id;
        
        const result = await fetch(`${server.USER_URL}/${id}`, {

            method: 'PUT',
            body: user

        });

        return result;
        
    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const deleteUser = async (id: string) => {

    try {
       
        const result = await fetch(`${server.USER_URL}/${id}`, {

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
