import { getAds, getAdsById, createAds,  updateAds, deleteAds } from '../services/api/ads-api-service';

export const useApiAds = () => {
    return {
        getAds,
        getAdsById,
        createAds,
        updateAds,
        deleteAds
    };
};
