import { useFetcher } from '../../composables/useFetcher';
import { server } from '../../utils/constants';



const { fetch } = useFetcher();

export const getAds = async (start: string, limit: string) => {
    try {
        
        const result = await fetch(`${server.ADS_URL}?start=${start}&limit=${limit}`);
        return result;

    } catch (error) {

        console.error('Error creating ads:', error);
        throw error;

    }

};

export const getAdsById = async (id: any) => {

    try {

        const result = await fetch(`${server.ADS_URL}/${id}`);
        return result;

    } catch (error) {

        console.error('Error creating ads:', error);
        throw error;

    }
};

export const createAds = async (ads: FormData) => {

    try {
        const result = await fetch('ads/ads', {
            method: 'POST',
            body: ads,
        });

        return result

    } catch (error: any) {
        console.error('Error creating ads:', error);
        throw error;
    }
};




export const updateAds = async (ads: FormData) => {

    try {

        const result = await fetch(`${server.ADS_URL}/1`, {

            method: 'PUT',
            body: ads

        });
        
        return result;
        
    } catch (error) {

        console.error('Error creating ads:', error);
        throw error;

    }
};

export const deleteAds = async (data: any) => {

    try {
        
        const ads_id = data.value.id || '';
        const lang = data.value.currentLang || '';
        const picture = data.value.adsLanguages.cover_picture || '';
        const newKey = data.value.newKey || '';
        const result = await fetch(`${server.ADS_URL}/1`, {

            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                adsID: ads_id,
                lang: lang,
                newKey: newKey,
                picture: picture
            })
            
        });
        
        return result;

    } catch (error) {

        console.error('Error creating ads:', error);
        throw error;

    }
    
};
