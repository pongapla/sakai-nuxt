import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiAds } from './../composables/useApiAds';
import { FetchingStatus } from '../types/enums/FetchingStatus';

export const  useAdsStore =  defineStore("ads", () => {

    const fetchingStatus = ref<FetchingStatus>(FetchingStatus.init);
    const api = useApiAds();

    const createAds = async (ads: FormData) => {
        try {
            
            const result = await api.createAds(ads);
            return result;
            
        } catch (error) {
            
            console.error('Error creating ads:', error);
            return error;
        }
    };

    const createAdsLanguage = async (ads: FormData) => {
        try {
            
            const result = await api.createAds(ads);
            return result;
            
        } catch (error) {
            
            console.error('Error creating ads:', error);
            return error;
        }
    };

    const getAds = async (start: string,limit: string) => {
        try {
           
            const result = await api.getAds(start,limit);
            return result;

        } catch (error) {

            return error;

        } finally {
            FetchingStatus.success;
        }
    };

    const updateAdsLanguage = async (ads: FormData) => {
        
        try {

            const result = await api.updateAds(ads);
            return result;

        } catch (error) {
            return error;
        } finally {
            
        }
    }

    const deleteAds = async (data: any) => {

        try {
            
            const result = await api.deleteAds(data);
            return result;
        } catch (error) {
            return error;
        } finally {

        }

    }

    return {

        fetchingStatus,
        createAds,
        createAdsLanguage,
        getAds,
        updateAdsLanguage,
        deleteAds
    };

});