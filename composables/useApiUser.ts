import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/api/user-api-service';

export const useApiUser = () => {
    return {
        getUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser
    };
};
