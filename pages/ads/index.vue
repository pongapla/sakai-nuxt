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
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialog for Add/Edit Ads -->
    <div class="grid">
        <div class="col-12 lg:col-6">
            <Dialog :header="dialogHeader" v-model:visible="display" :breakpoints="{ '960px': '70vw' }" :style="{ width: '30vw', height: '80vh' }" :modal="true" @hide="closeDialog">
                <hr />
                <div style="margin-left: 15px">Show in</div>
                <div style="margin-left: 20px; margin-top: 20px;">
                  <div class="flex-flow flex-col gap-12">
                        
                        <div v-for="show of showAds" :key="show.key" class="flex flex-col items-start gap-2">
                            <Checkbox v-model="selectedAds" :inputId="show.key" name="category" :value="show.name" />
                            <label :for="show.key">{{ show.name }}</label>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px">
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Title :</h5>
                        <div class="col mb-3">
                            <InputText type="text" placeholder="Title" v-model="formData.title" class="custom-input" />
                            <small v-if="errorMessages.title" class="p-error">{{ errorMessages.title }}</small>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { Language } from '../../types/types/language';
import { Ads } from '../../types/types/ads';
import { useAdsStore } from '../../stores/ads.store';
import { useApiLanguages } from '../../stores/languagus.store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { useCustomToast } from '../../composables/useToast';

const display = ref(false);
const isEditMode = ref(false);
const loading2 = ref(false);
const adsSearchQuery = ref('');
const adsInfo = ref<Ads[]>([]);
const selectedLangauge = ref();
const languages = ref<Language[]>([]);
const selectedAds = ref();
const deleteAdsLanguageDialog = ref(false);
const adsStore = useAdsStore();
const languagesStore = useApiLanguages();
const first = ref(0);
const rows = ref(10);
const totalRecords = ref(0);
const { showSuccess, showError } = useCustomToast();
const dialogHeader = ref('New Ads');

const showAds = ref([
    { name: 'Show in news category list 1200 x 800', key: 'is_list' },
    { name: 'Show on news content page 1200 x 800', key: 'is_news_content' },
    { name: 'Show as popup 1200 x 800', key: 'is_popup' },
    { name: 'Show the footer of the news category 600 x 150', key: 'R' }
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
        } catch (error) {
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
    formData.group = data.group;
    open();
};

const closeDialog = () => {
    display.value = false;
    isEditMode.value = false;
    selectedLangauge.value = null;
    resetForm();
    resetError();
};

const formData = reactive({
    group: '',
    title: '',
    lang_id: null as number | null
});

const initialFormData = {
    group: '',
    title: '',
    lang_id: null as number | null
};

const errorMessages = reactive({
    title: '',
    lang_id: null as number | null
});

const initialErroMessages = {
    title: '',
    lang_id: null as number | null
};

const resetForm = () => {
    Object.assign(formData, initialFormData);
};

const resetError = () => {
    Object.assign(errorMessages, initialErroMessages);
};

const save = () => {
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    formData.lang_id = selectedLangauge.value;

    const formDataObject = new FormData();

    formDataObject.append('body', JSON.stringify(formData));

    if (formData.group) {
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
    } catch (error) {
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

        const index = adsInfo.value.findIndex((item) => item.title === newAdsLanguage.title);

        if (index !== -1) {
            adsInfo.value[index] = newAdsLanguage;
        } else {
            adsInfo.value.push(newAdsLanguage);
        }

        showSuccess('Ads-language added successfully!');
    } catch (error) {
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
        newUpdate.currentLang = 'TH';

        const index = adsInfo.value.findIndex((item) => item.title === newUpdate.title);

        if (index !== -1) {
            adsInfo.value[index] = newUpdate;
        } else {
            adsInfo.value.push(newUpdate);
        }

        showSuccess('Ads-language update successfully!');
    } catch (error) {
        showError(error.message);
    }
};

const editAds = (data: any) => {
    const lang_index = data.languageList.indexOf(data.currentLang);
    const title_index = data.languageTitles[lang_index];
    data.title = title_index;
    const lang = languages.value.find((lang) => lang.lang_flag === data.currentLang);
    selectedLangauge.value = lang?.id;
    formData.title = data.title;
    formData.group = data.group;
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
        const flag = selectedAds.value.currentLang;
        const titleSeach = selectedAds.value.title;
        const index = adsInfo.value.findIndex((item) => item.title === selectedAds.value.title);
        const result = await adsStore.deleteAds(selectedAds);

        if (result.status == 'del-ads') {
            if (index !== -1) {
                adsInfo.value.splice(index, 1);
            }
        }

        if (result.status == 'del-lang') {
            if (index !== -1) {
                adsInfo.value[index].languageList = adsInfo.value[index].languageList.filter((lang) => lang !== flag);
                adsInfo.value[index].languageTitles = adsInfo.value[index].languageTitles.filter((title) => title !== titleSeach);

                adsInfo[index] = {
                    ...adsInfo[index]
                };
            }
        }
    } catch (error) {
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
            console.log(adsInfo.value);
        } catch (error) {
            showError(error.message);
        } finally {
            loading2.value = false;
        }
    }, 600);
});

const validateForm = () => {
    let isValid = true;
    return isValid;
};

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

    if (langObject && langObject.cover_picture) {
        return `/images/ads/${langObject.cover_picture}`;
    }

    const fallbackLangObject = rowData.adsLanguages[0];
    if (fallbackLangObject && fallbackLangObject.cover_picture) {
        return `/images/ads/${fallbackLangObject.cover_picture}`;
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
</style>
