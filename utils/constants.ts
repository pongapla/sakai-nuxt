export const NETWORK_CONNECTION_MESSAGE = 'Cannot connect to server, Please try again';
export const NETWORK_TIMOUT_MESSAGE = 'A network timeout has occurred, Please try again';
export const NOT_CONNECT_NETWORK = 'Not connect network';
export const UPLOAND_PHOTO_FAIL_MESSAGE = 'An error has occurred. The photo was unable to upload.';
export const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL + '/api/v1';
export const imgUrl = import.meta.env.VITE_BACKEND_BASE_URL + '/images/news';

export const server = {
    LOGIN_URL: `login/login`,
    NEWS_URL: `News`,
    USER_URL: `user`,
    TRANSACTION_URL: `transaction`,
    TOKEN_KEY: `token`,
    USERNAME: `userName`,
    CATEGORY_URL: `category`,
    LANGUAGE_URL: `language`,
    ADS_URL: `ads`
};

export const errMsg = [
    { k: 200, v: 'api-res.ok' },
    { k: 307, v: 'api-res.err.temporary-redirect' },
    { k: 400, v: 'api-res.err.bad-request' },
    { k: 401, v: 'api-res.err.unauthorized' },
    { k: 403, v: 'api-res.err.forbidden ' },
    { k: 404, v: 'api-res.err.not-found' },
    { k: 406, v: 'api-res.err.not-acceptable' },
    { k: 408, v: 'api-res.err.request-time-out' },
    { k: 421, v: 'api-res.err.misdirected-request' },
    { k: 423, v: 'api-res.err.locked' },
    { k: 500, v: 'api-res.err.internal-server-error' },
    { k: 502, v: 'api-res.err.bad-gateway' },
    { k: 503, v: 'api-res.err.service-unavailable' }
];
