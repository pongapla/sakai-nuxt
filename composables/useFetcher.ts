import { apiUrl, NOT_CONNECT_NETWORK, NETWORK_CONNECTION_MESSAGE } from '../utils/constants';

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

const fetchConfig = {
    headers: {}
};

export const setAuthorizationHeader = (token: string) => {
    // @ts-ignore
    fetchConfig.headers.Authorization = `Bearer ${token}`;
};

export const clearAuthorizationHeader = () => {
    // @ts-ignore
    delete fetchConfig.headers.Authorization;
};

export const useFetcher = () => {

    const fetcher = async (url: string, options?: RequestInit | any) => {

        try {
            
            url = url.startsWith('/') ? url : `/${url}`;

            const absoluteUrl = isAbsoluteURLRegex.test(url) ? url : `${apiUrl}${url}`;
            
            const response = (await $fetch(absoluteUrl, {
                ...fetchConfig,
                ...options
            })) as any;
            
            return await response;

        } catch (error: any) {

            throw error;
        }
    };

    return {

        fetch: fetcher
        
    };
};
