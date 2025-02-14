import { useFetcher } from '../../composables/useFetcher';
import { server, apiUrl } from '../../utils/constants';



const { fetch } = useFetcher();

export const getTeams = async (start: string, limit: string) => {
    try {
        
        const result = await fetch(`${server.USER_URL}?start=${start}&limit=${limit}`);
        
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }

};

export const getTeamById = async (id: any) => {

    try {

        const result = await fetch(`${server.USER_URL}/${id}`);
        return result;

    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const createTeam = async (Team: FormData) => {
    
    try {
        
        const resoult = await fetch('user/user', {
            method: 'POST',
            body: Team,
        });
        
            return resoult ;

    } catch (error) {
        
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateTeam = async (team: FormData) => {

    try {

        const bodyString = team.get('body') as string;
        const jsonData = JSON.parse(bodyString);
        const id = jsonData.id;
        
        const result = await fetch(`${server.USER_URL}/${id}`, {

            method: 'PUT',
            body: team

        });

        return result;
        
    } catch (error) {

        console.error('Error creating user:', error);
        throw error;

    }
};

export const deleteTeam = async (id: string) => {

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
