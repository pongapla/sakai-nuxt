import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiTeam } from './../composables/useApiTeam';
import { FetchingStatus } from '../types/enums/FetchingStatus';


export const  useTeamStore =  defineStore("team", () => {

    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
    const api = useApiTeam();

    const createTeam = async (team: FormData) => {
        try {
            
            const resoult = await api.createTeam(team);
            return resoult;
            
        } catch (error) {
            
            console.error('Error creating team:', error);
            return error;
        }
    };

    
    const getTeams = async (start: string,limit: string) => {
        try {

            const result = await api.getTeams(start,limit);
            return result;

        } catch (error) {

            return error;

        } finally {
            FetchingStatus.success;
        }
    };

    const updateTeam = async (team: FormData) => {
        
        try {

            const result = await api.updateTeam(team);
            return result;

        } catch (error) {
            return error;
        } finally {
            
        }
    }

    const deleteTeam = async (id: string) => {

        try {
            const result = await api.deleteTeam(id);
            return result;
        } catch (error) {
            return error;
        } finally {

        }

    }

    return {

        fetchingStatus,
        createTeam,
        getTeams,
        updateTeam,
        deleteTeam,
    };
});
