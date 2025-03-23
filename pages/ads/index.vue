<template>
    <div class="col-12">
        <div class="card">
            <div class="row">
                <Toast />
                <div class="custom-row">
                    <div class="custom-col">
                        <h4 class="text-gray">Management Ads</h4>
                    </div>
                    <div class="custom-col input-container">
                        <InputText type="text" name="search" placeholder="Search" class="underline-input" v-model="adsSearchQuery" />
                        <i class="pi pi-search search-icon"></i>
                    </div>
                    <div class="custom-col rigthB">
                        <Button label="Add Ads" icon="pi pi-plus" severity="success" outlined class="custom-button-size" @click="open" />
                    </div>
                </div>

                <div>
                    <DataTable
                        :value="filteredAdsInfo"
                        :scrollable="true"
                        :totalRecords="totalRecords"
                        paginator
                        :lazy="true"
                        :rows="10"
                        :rowsPerPageOptions="[10, 20, 50, 100]"
                        :first="first"
                        @page="onPage"
                        class="mt-3"
                        emptyMessage="No Ads available."
                        :loading="loading2"
                    >
                        <Column field="title" style="width: 150px; text-align: left">
                            <template #header>
                                <span class="flex-1 text-center">Title</span>
                            </template>
                            <template #body="slotProps">
                                {{ getTitle(slotProps.data) }}
                            </template>
                        </Column>
                        <Column field="cover_picture" style="min-width: 50px; text-align: center">
                            <template #header>
                                <span class="flex-1 text-center">Picture</span>
                            </template>
                            <template #body="slotProps">
                                <img :src="getCoverPicture(slotProps.data)" :alt="slotProps.data.image" class="w-24 rounded" width="150" height="70" />
                            </template>
                        </Column>
                        <Column field="detail" style="width: 150px">
                            <template #header>
                                <span class="fiex-1 text-center">Deail</span>
                            </template>
                            <template #body="slotProps">
                                {{ getDetail(slotProps.data) }}
                            </template>
                        </Column>
                        <Column field="language" style="width: 200px; text-align: center">
                            <template #header>
                                <span class="flex-1 text-center">Language</span>
                            </template>
                            <template #body="slotProps">
                                <div>
                                    <button
                                        v-for="(lang, index) in slotProps.data.adsLanguages"
                                        :key="index"
                                        :class="{ 'p-button': true, 'p-button-outlined': true, 'p-button-active': lang.language.lang_flag === slotProps.data.currentLang }"
                                        @click="changeLanguage(slotProps.data, lang.language.lang_flag)"
                                        style="margin-right: 3px"
                                    >
                                        {{ lang.language.lang_flag }}
                                    </button>
                                </div>
                            </template>
                        </Column>
                        <Column field="active" style="width: 100px; text-align: center">
                            <template #header>
                                <span class="flex-1 text-center">Active</span>
                            </template>
                            <template #body="slotProps">
                                <div class="flex justify-content-center">
                                    <Button icon="pi pi-plus" outlined rounded class="mr-1" @click="openAdsLanguage(slotProps.data)" />

                                    <Button icon="pi pi-pencil" outlined rounded class="mr-1" @click="editAds(slotProps.data)" />

                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAds(slotProps.data)" />
                                </div>
                            </template>
                        </Column>
                        <Column field="start_date" style="width: 150px; text-align: center">
                            <template #header>
                                <span class="flex-1 text-center">Publish date</span>
                            </template>
                        </Column>
                        <Column field="stop_date" style="width: 150px; text-align: center">
                            <template #header>
                                <span class="flex-1 text-center">Stop date</span>
                            </template>
                        </Column>
                        <Column field="active" style="width: 100px; text-align: center" frozen alignFrozen="right">
                            <template #header>
                                <span class="flex-1 text-center">Active</span>
                            </template>
                            <template #body="slotProps">
                                <div class="flex justify-content-center">
                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAds(modifyData(slotProps.data))" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialog for Add/Edit Ads -->
    <div class="grid">
        <div class="col-12 lg:col-6">
            <Dialog :header="dialogHeader" v-model:visible="display" :breakpoints="{ '960px': '70vw' }" :style="{ width: '32vw', height: 'auto' }" :modal="true" @hide="closeDialog">
                <hr />
                <div style="margin-left: 15px">Show in</div>
                <div v-if="isAddLanguage" style="margin-left: 20px; margin-top: 20px">
                    <div class="flex-flow flex-col gap-12">
                        <div v-for="show of showAds" :key="show.key" class="flex flex-col items-start gap-2 mb-3">
                            <input class="custom-checkbox" type="checkbox" v-model="formData[show.key]" :inputId="show.key" name="show" :value="show.key" />

                            <label :for="show.key">{{ show.name }}</label>
                        </div>

                        <small v-if="errorMessages.showError" class="p-error">{{ errorMessages.showError }}</small>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">Title :</h6>
                        <div class="col mb-3">
                            <InputText type="text" placeholder="Title" v-model="formData.adsLanguages.title" style="width: 100%" />
                            <small v-if="errorMessages.adsLanguages.title" class="p-error">{{ errorMessages.adsLanguages.title }}</small>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div class="grid align-items-center" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">Detail :</h6>
                        <div class="col">
                            <Textarea v-model="formData.adsLanguages.detail" placeholder="Detail" rows="1" cols="20" style="width: 100%" />
                            <small v-if="errorMessages.adsLanguages.detail" class="p-error">{{ errorMessages.adsLanguages.title }}</small>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div class="grid align-items-center" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">Language :</h6>
                        <div class="col">
                            <div class="col">
                                <Dropdown :options="languages" v-model="formData.adsLanguages.language.lang_flag" optionLabel="lang_name" placeholder="Select an language" optionValue="lang_flag" style="width: 100%" />
                            </div>
                            <small v-if="errorMessages.adsLanguages.language.lang_flag" class="p-error">{{ errorMessages.adsLanguages.language.lang_flag }}</small>
                        </div>
                    </div>
                </div>
                <div v-if="isAddLanguage" style="margin-left: 20px">
                    <div class="grid align-items-center" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">Start Date :</h6>
                        <div class="col mb-3">
                            <Calendar v-model="formData.start_date" showIcon iconDisplay="input" dateFormat="dd/mm/yy" style="width: 100%" />
                            <small v-if="errorMessages.start_date" class="p-error">{{ errorMessages.start_date }}</small>
                        </div>
                    </div>
                </div>
                <div v-if="isAddLanguage" style="margin-left: 20px">
                    <div class="grid align-items-center" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">Stop Date :</h6>
                        <div class="col">
                            <Calendar v-model="formData.stop_date" showIcon iconDisplay="input" dateFormat="dd/mm/yy" style="width: 100%" />
                            <small v-if="errorMessages.stop_date" class="p-error">{{ errorMessages.stop_date }}</small>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">URL :</h6>
                        <div class="col mb-3">
                            <InputText type="text" placeholder="url" v-model="formData.adsLanguages.url" style="width: 100%" />
                            <small v-if="errorMessages.adsLanguages.url" class="p-error">{{ errorMessages.adsLanguages.url }}</small>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div class="grid align-items-center" style="display: flex; align-items: center">
                        <h6 style="margin-right: 0px; padding-top: 20px">Picture :</h6>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <FileUpload ref="fileupload" mode="basic" name="cover_picture" accept="image/*" :maxFileSize="1000000" @select="onUpload" />
                        </div>
                    </div>
                </div>
                <div class="mt-3" style="text-align: right">
                    <Button label="Cancel" @click="closeDialog" icon="pi pi-times" class="p-button-outlined" :style="{ color: 'red', borderColor: 'red', marginRight: '10px' }" />
                    <Button label="Save" @click="save" icon="pi pi-check" class="p-button-outlined" />
                </div>
            </Dialog>
        </div>
    </div>

    <Dialog v-model:visible="deleteAdsLanguageDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span>Are you sure you want to delete the selected ads language?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" style="color: red" text @click="deleteAdsLanguageDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedAds" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { Language } from '../../types/types/language';
import { Ads } from '../../types/types/ads';
import { useAdsStore } from '../../stores/ads.store';
import { useApiLanguages } from '../../stores/languagus.store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import { useCustomToast } from '../../composables/useToast';

const display = ref(false);
const isEditMode = ref(false);
const loading2 = ref(false);
const adsSearchQuery = ref('');
const adsInfo = ref<Ads[]>([]);
const files = ref<File[]>([]);
const languages = ref<Language[]>([]);
const deleteAdsLanguageDialog = ref(false);
const adsStore = useAdsStore();
const languagesStore = useApiLanguages();
const selectedAds = ref();
const first = ref(0);
const rows = ref(10);
const totalRecords = ref(0);
const { showSuccess, showError } = useCustomToast();
const dialogHeader = ref('New Ads');
const isAddLanguage = ref(true);

const showAds = ref([
    { name: 'Show in news category list 1200 x 800', key: 'is_list' },
    { name: 'Show on news content page 1200 x 800', key: 'is_news_content' },
    { name: 'Show as popup 1200 x 800', key: 'is_popup' },
    { name: 'Show the footer of the news category 600 x 150', key: 'is_slide' }
]);

const onPage = (event: any) => {
    first.value = event.first;
    rows.value = event.rows;
    loadPageData();
};

const loadPageData = async () => {
    loading2.value = true;

    setTimeout(async () => {
        try {
            const data = await adsStore.getAds(first.value.toString(), rows.value.toString());
            adsInfo.value = data.data;
            totalRecords.value = data.totalCount;
            adsInfo.value.forEach((ads: any) => {
                ads.currentLang = 'TH';
            });
        } catch (error: any) {
            showError(error.message);
        } finally {
            loading2.value = false;
        }
    }, 1000);
};

const open = () => {
    display.value = true;
};

const openAdsLanguage = (data: any) => {
    dialogHeader.value = 'New Ads Language';
    isAddLanguage.value = false;
    formData.id = data.id;
    open();
};

const closeDialog = () => {
    display.value = false;
    isEditMode.value = false;
    isAddLanguage.value = true;
    resetForm();
    resetError();
};

const formData = reactive({
    id: '',
    start_date: null,
    stop_date: null,
    is_popup: false,
    is_slide: false,
    is_news_content: false,
    is_list: false,
    adsLanguages: {
        title: '',
        detail: '',
        cover_picture: '',
        url: '',
        language: {
            lang_flag: ''
        }
    }
});

let errorMessages = reactive({
    showError: '',
    start_date: '',
    stop_date: '',
    is_popup: false,
    is_slide: false,
    is_news_content: false,
    is_list: false,
    adsLanguages: {
        title: '',
        detail: '',
        cover_picture: '',
        url: '',
        language: {
            lang_flag: ''
        }
    }
});

const resetForm = () => {
    //Object.assign(formData, initialFormData);
    formData.id = '';
    formData.is_list = false;
    formData.is_news_content = false;
    formData.is_popup = false;
    formData.is_slide = false;
    formData.start_date = null;
    formData.stop_date = null;
    formData.adsLanguages.detail = '';
    formData.adsLanguages.title = '';
    formData.adsLanguages.url = '';
    formData.adsLanguages.cover_picture = '';
    formData.adsLanguages.language.lang_flag = '';
};

const resetError = () => {
    (errorMessages.showError = ''),
        (errorMessages.start_date = ''),
        (errorMessages.stop_date = ''),
        (errorMessages.is_popup = false),
        (errorMessages.is_slide = false),
        (errorMessages.is_news_content = false),
        (errorMessages.is_list = false),
        (errorMessages.adsLanguages = {
            title: '',
            detail: '',
            cover_picture: '',
            url: '',
            language: {
                lang_flag: ''
            }
        });
};

const save = () => {
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    //formData.lang_id = selectedLangauge.value;

    const formDataObject = new FormData();

    if (files.value && files.value.length > 0) {
        formDataObject.append('file', files.value[0]);
        formData.adsLanguages.cover_picture = files.value[0].name;
    } else {
        formData.adsLanguages.cover_picture = '';
    }

    formDataObject.append('body', JSON.stringify(formData));

    if (formData.id) {
        isEditMode.value ? updateAds(formDataObject) : addAdsLanguage(formDataObject);
    } else {
        addAds(formDataObject);
    }

    display.value = false;
};

const addAds = async (formDataObject: FormData) => {
    try {
        const result = await adsStore.createAds(formDataObject);
        const newAds = result.data;
        newAds.currentLang = 'TH';

        adsInfo.value.push(newAds);

        showSuccess('Ads added successfully!');
    } catch (error: any) {
        console.error('Error while adding Ads: ', error.message);
        showError(error.message);
    } finally {
    }
};

const addAdsLanguage = async (formDataObject: FormData) => {
    try {
        const result = await adsStore.createAdsLanguage(formDataObject);

        if (result.status === 400) {
            showError(result.message);
            return;
        }

        const newAdsLanguage = result.data;
        newAdsLanguage.currentLang = 'TH';

        const index = adsInfo.value.findIndex((item) => item.id === newAdsLanguage.id);

        if (index !== -1) {
            adsInfo.value[index] = newAdsLanguage;
        } else {
            adsInfo.value.push(newAdsLanguage);
        }

        showSuccess('Ads-language added successfully!');
    } catch (error: any ) {
        console.error('Error while adding ads-language: ', error.message);
        showError(error.message);
    } finally {
    }
};

const updateAds = async (formDataObject: FormData) => {
    try {
        const result = await adsStore.updateAdsLanguage(formDataObject);

        if (result.status === 400) {
            showError(result.message);
            return;
        }

        const newUpdate = result.data;
        
        const hasTHLanguage = newUpdate.adsLanguages.some((lang: any) => lang.language.lang_flag === 'TH');

        if (!hasTHLanguage) {
            
            if (newUpdate.adsLanguages.length > 0) {
                newUpdate.currentLang = newUpdate.adsLanguages[0].language.lang_flag;
            } 
        } else {
           
            newUpdate.currentLang = 'TH';
        }

        const index = adsInfo.value.findIndex((item) => item.id === newUpdate.id);

        if (index !== -1) {
            adsInfo.value[index] = newUpdate;
        }

        showSuccess('Ads-language update successfully!');
    } catch (error: any) {
        showError(error.message);
    }
};

const editAds = (data: any) => {
    isEditMode.value = true;
    const selectedLanguage = data.adsLanguages.find((lang: any) => lang.language.lang_flag === data.currentLang);
    const lang = languages.value.find((lang) => lang.lang_flag === data.currentLang);
    formData.adsLanguages.language.lang_flag = lang?.lang_flag || '';

    formData.id = data.id;
    formData.is_list = data.is_list || false;
    formData.is_news_content = data.is_news_content || false;
    formData.is_popup = data.is_popup || false;
    formData.is_slide = data.is_slide || false;
    formData.start_date = data.start_date;
    formData.stop_date = data.stop_date;

    if (selectedLanguage) {
        formData.adsLanguages.title = selectedLanguage.title;
        formData.adsLanguages.detail = selectedLanguage.detail;
        formData.adsLanguages.cover_picture = selectedLanguage.cover_picture;
        formData.adsLanguages.url = selectedLanguage.url;
    }

    dialogHeader.value = 'Edit Ads Language';
    isEditMode.value = true;
    open();
};

const confirmDeleteAds = async (data: any) => {
    deleteAdsLanguageDialog.value = true;
    selectedAds.value = await data;
};

const modifyData = async (data: any) => {
    data.newKey = '1';
    return data;
};

const deleteSelectedAds = async () => {
    if (!selectedAds) return;

    try {
        const flag = selectedAds;
        const titleSeach = selectedAds.value;
        const index = adsInfo.value.findIndex((item) => item.id === selectedAds.value.id);
        const result = await adsStore.deleteAds(selectedAds);
        
        if (result.status == 'del-ads' || result.status == 'del-ads-lang') {
            if (index !== -1) {
                adsInfo.value.splice(index, 1);
            }
        }

        if (result.status == 'del-lang') {
            if (index !== -1) {
                adsInfo.value[index].adsLanguages = adsInfo.value[index].adsLanguages.filter((lang: any) => lang.language.lang_flag !== flag.value.currentLang);

                if (adsInfo.value[index].adsLanguages.length > 0) {
                    flag.value.currentLang = adsInfo.value[index].adsLanguages[0].language.lang_flag;
                }
                adsInfo.value[index] = { ...adsInfo.value[index] };
            }
        }

        if (result.status == 'del-ads-lang') {
            if (index !== -1) {
                adsInfo.value.splice(index, 1);
            }
        }
    } catch (error: any) {
        showError(error.message);
    } finally {
        deleteAdsLanguageDialog.value = false;
        showSuccess('Ads-language delete successfully!');
    }
};

const filteredAdsInfo = computed(() => {
    if (adsSearchQuery.value === '') {
        return adsInfo.value;
    } else {
        return adsInfo.value.filter((ads) => {
            return ads.adsLanguages.some((lang: any) => lang.title.toLowerCase().includes(adsSearchQuery.value.toLowerCase()));
        });
    }
});

onMounted(async () => {
    loading2.value = true;

    setTimeout(async () => {
        try {
            const data = await adsStore.getAds(first.value.toString(), rows.value.toString());
            adsInfo.value = data.data;
            adsInfo.value.forEach((ads: any) => {
                ads.currentLang = 'TH';
            });
            totalRecords.value = data.totalCount;
            
            const dataLanguage = await languagesStore.getLanguages();
            languages.value = dataLanguage.data;
        } catch (error: any ) {
            showError(error.message);
        } finally {
            loading2.value = false;
        }
    }, 600);
});

const validateForm = () => {
    let isValid = true;

    if (isAddLanguage.value) {
        // Check if at least one option is selected
        if (!formData.is_list && !formData.is_news_content && !formData.is_popup && !formData.is_slide) {
            errorMessages.showError = 'Please select at least one option.';
            isValid = false;
        }

        // Check if start date is selected
        if (!formData.start_date) {
            errorMessages.start_date = 'Please select a start date.';
            isValid = false;
        }

        // Check if stop date is selected
        if (!formData.stop_date) {
            errorMessages.stop_date = 'Please select a stop date.'; // Fix the error message key for stop_date
            isValid = false;
        }

        // Check if title is provided
        if (!formData.adsLanguages.title) {
            errorMessages.adsLanguages.title = 'Please enter a title.';
            isValid = false;
        }

        // Check if language is selected
        if (!formData.adsLanguages.language.lang_flag) {
            errorMessages.adsLanguages.language.lang_flag = 'Please select a language.'; // Corrected the error message key
            isValid = false;
        }
    } else {
        if (!formData.adsLanguages.title) {
            errorMessages.adsLanguages.title = 'Please enter a title.';
            isValid = false;
        }

        if (!formData.adsLanguages.language.lang_flag) {
            errorMessages.adsLanguages.language.lang_flag = 'Please select a language.';
            isValid = false;
        }
    }

    return isValid;
};

watch(
    () => ({
        is_list: formData.is_list,
        is_news_content: formData.is_news_content,
        is_popup: formData.is_popup,
        is_slide: formData.is_slide,
        start_date: formData.start_date,
        stop_date: formData.stop_date,
        lang_flag: formData.adsLanguages.language.lang_flag,
        title: formData.adsLanguages.title
    }),
    (newValues, oldValues) => {
        const { is_list, is_news_content, is_popup, is_slide, start_date, stop_date, lang_flag, title } = newValues;

        // ตรวจสอบว่าอย่างน้อย 1 ตัวเลือกถูกเลือกหรือไม่
        if (!is_list && !is_news_content && !is_popup && !is_slide) {
            errorMessages.showError = 'Please select at least one option.';
        } else {
            errorMessages.showError = '';
        }

        // เพิ่มเงื่อนไขสำหรับ start_date และ stop_date
        if (!start_date) {
            errorMessages.start_date = 'Please select a start date.';
        } else {
            errorMessages.start_date = '';
        }

        if (!stop_date) {
            errorMessages.stop_date = 'Please select a stop date.';
        } else {
            errorMessages.stop_date = '';
        }

        // เพิ่มเงื่อนไขสำหรับ title และ language flag
        if (!title) {
            errorMessages.adsLanguages.title = 'Please enter a title.';
        } else {
            errorMessages.adsLanguages.title = '';
        }

        if (!lang_flag) {
            errorMessages.adsLanguages.language.lang_flag = 'Please select a language.';
        } else {
            errorMessages.adsLanguages.language.lang_flag = '';
        }
    }
);

const changeLanguage = (rowData: any, lang: any) => {
    rowData.currentLang = lang;
};

const getTitle = (rowData: any) => {
    if (!rowData.adsLanguages || !Array.isArray(rowData.adsLanguages) || !rowData.currentLang) {
        return '';
    }

    const langObject = rowData.adsLanguages.find((lang: any) => lang.language.lang_flag === rowData.currentLang);

    if (langObject) {
        return langObject.title;
    }

    const fallbackLangObject = rowData.adsLanguages[0];
    if (fallbackLangObject) {
        return fallbackLangObject.title;
    }

    return rowData.title;
};

const getCoverPicture = (rowData: any) => {
    if (!rowData.adsLanguages || !Array.isArray(rowData.adsLanguages) || !rowData.currentLang) {
        return '/images/ads/no-image-icon.png';
    }

    const langObject = rowData.adsLanguages.find((lang: any) => lang.language.lang_flag === rowData.currentLang);

    if (langObject && langObject?.cover_picture) {
      return `/images/ads/${langObject.cover_picture}?${new Date().getTime()}`;
    }

    const fallbackLangObject = rowData.adsLanguages[0];
    if (fallbackLangObject && fallbackLangObject?.cover_picture) {
      return `/images/ads/${fallbackLangObject.cover_picture}?${new Date().getTime()}`;
    }

    return '/images/ads/no-image-icon.png';
};

const getDetail = (rowData: any) => {
    if (!rowData.adsLanguages || !Array.isArray(rowData.adsLanguages) || !rowData.currentLang) {
        return '';
    }

    const langObject = rowData.adsLanguages.find((lang: any) => lang.language.lang_flag === rowData.currentLang);

    if (langObject) {
        return langObject.detail;
    }

    const fallbackLangObject = rowData.adsLanguages[0];
    if (fallbackLangObject) {
        return fallbackLangObject.detail;
    }

    return '';
};

const onUpload = (event: any) => {
    files.value = event.files;
};
</script>

<style scoped>
/* สไตล์สำหรับหน้าจอ */
.custom-row {
    display: flex;
    justify-content: space-between;
}

.custom-col {
    flex: 1;
    padding: 10px;
}

.input-container {
    position: relative;
    width: 200px;
    align-items: flex-end;
}

.underline-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #ebe5e5;
    outline: none;
    padding-right: 40px;
    box-shadow: none;
    border-radius: 0;
}

.underline-input::placeholder {
    font-size: 1.6rem;
    color: #999;
}

.search-icon {
    position: absolute;
    right: 0;
    top: 40%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
}

.rigthB {
    display: flex;
    justify-content: flex-end;
}

.custom-button-size {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    height: auto;
}

.custom-button-size .pi {
    font-size: 2rem;
    margin-right: 0.5rem;
}

.text-gray {
    color: #808080;
}

.custom-input {
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    width: 100%;
}

.custom-input:focus {
    border-bottom: 2px solid #ccc;
    outline: none;
}

.p-button-active {
    background-color: rgba(16, 185, 129, 0.06) !important;
    color: #10b981 !important;
    border: 1px solid;
}

.p-button-active:hover {
    background-color: rgba(16, 185, 129, 0.06) !important;
    color: #10b981 !important;
    border: 1px solid;
}

.p-dropdown:not(.p-disabled).p-focus {
    outline: none !important;
}

.custom-checkbox {
    width: 20px;
    height: 20px;
    transform: scale(1);
    cursor: pointer;
    border-color: gray;
}
</style>
