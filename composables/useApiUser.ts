import { getUsers } from '../services/api/user-api-service';

export const useApiUser = () => {
    return {
        getUsers
    };
};
