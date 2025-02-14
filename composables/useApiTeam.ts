import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } from '../services/api/team-api-service';

export const useApiTeam = () => {
    return {
        getTeams,
        getTeamById,
        createTeam,
        updateTeam,
        deleteTeam
    };
};
