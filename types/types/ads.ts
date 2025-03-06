export type AdsLanguage = {
    title: string;
    detail: string;
    cover_picture: string;
    url: string;
    language: {
        lang_flag: string;
    };
};

export type Ads = {
    id: number;
    start_date: string;
    stop_date: string;
    is_popup: boolean;
    is_slide: boolean;
    is_news_content: boolean;
    is_list: boolean;
    adsLanguages: AdsLanguage[];
};
