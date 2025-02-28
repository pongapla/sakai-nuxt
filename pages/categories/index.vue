<template>
  <div class="grid">
      <div class="col-12">
          <div class="card">
              <div class="row">
                  <Toast />
                  <div class="custom-row">
                      <div class="custom-col">
                          <h4 class="text-gray">Management Categories</h4>
                      </div>
                      <div class="custom-col input-container">
                          <InputText type="text" name="search" placeholder="Search" class="underline-input" v-model="categorySearchQuery" />
                          <i class="pi pi-search search-icon" @click="search"></i>
                      </div>
                      <div class="custom-col rigthB">
                          <Button label="Add Category" icon="pi pi-plus" severity="success" outlined class="custom-button-size" @click="open" />
                      </div>
                  </div>

                  <!-- DataTable -->
                  <div>
                      <DataTable
                          :value="filteredCategoryInfo"
                          :scrollable="true"
                          :totalRecords="totalRecords"
                          paginator
                          :lazy="true"
                          :rows="10"
                          :rowsPerPageOptions="[10, 20, 50, 100]"
                          :first="first"
                          @page="onPage"
                          class="mt-3"
                          emptyMessage="No categories available."
                          :loading="loading2"
                      >
                     
                      <Column field="title" style="width: 300px; text-align: center;">
                        <template #header>
                          <span class="flex-1 text-center">Title</span>
                        </template>
                        <template #body="slotProps">

                          {{ getTitle(slotProps.data) }}
                          
                        </template>
                      </Column>
                        <Column  style="width: 300px; text-align: center;">
                          <template #header>
                            <span class="flex-1 text-center">Language</span>
                          </template>    
                          <template #body="slotProps">
                                  <div>
                                    <button v-for="(lang, index) in slotProps.data.languageList" 
                                            :key="index"
                                            :class="{'p-button': true, 'p-button-outlined': true, 'p-button-active': lang === slotProps.data.currentLang}"
                                            @click="changeLanguage(slotProps.data, lang)"
                                            style="margin-right: 3px;">
                                      {{ lang }}
                                    </button>
                                  </div>
                              </template>
                          </Column>
                          <Column field="action" style="width: 150px; text-align: center">
                            <template #header>
                              <span class="flex-1 text-center">Action Language</span>
                            </template>  
                            <template #body="slotProps">
                                  <div class="flex justify-content-center">
                                    
                                    <Button icon="pi pi-plus" outlined rounded class="mr-1" @click="openCategoryLanguage(slotProps.data)" />  
                                    
                                    <Button icon="pi pi-pencil" outlined rounded class="mr-1" @click="editCategory()" />
                                    
                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategory(slotProps.data)" />
                                  </div>
                              </template>
                          </Column>
                          <Column field="action" style="width: 150px; text-align: center">
                            <template #header>
                              <span class="flex-1 text-center">Action Category</span>
                            </template>
                            <template #body="slotProps">
                                  <div class="flex justify-content-center">
                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategory(modifyData(slotProps.data))" />
                                  </div>
                            </template>
                          </Column>
                      </DataTable>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <!-- Dialog for Add/Edit Category -->
  <div class="grid">
      <div class="col-12 lg:col-6">
          <Dialog :header="dialogHeader" v-model:visible="display" :breakpoints="{ '960px': '70vw' }" :style="{ width: '30vw', height: '40vh' }" :modal="true" @hide="closeDialog">
              <hr />
              <div style="margin-left: 20px">
                  <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                      <h5 style="margin-right: 0px; padding-top: 20px">Title :</h5>
                      <div class="col mb-3">
                          <InputText type="text" placeholder="Title" v-model="formData.title" class="custom-input" />
                          <small v-if="errorMessages.title" class="p-error">{{errorMessages.title}}</small>
                      </div>
                  </div>
              </div>
              <div style="margin-left: 20px">
                <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                      <h5 style="margin-right: 0px; padding-top: 20px">Language :</h5>
                      <div class="col mb-3">
                        <Dropdown 
                          :options="languages" 
                          v-model="selectedLangauge"
                          optionLabel="lang_name"
                          placeholder="Select an language"
                          optionValue="id"
                          class="custom-input"
                        />
                      </div>
                  </div>
              </div>
              <div class="mt-3" style="text-align: right">
                  <Button label="Cancel" @click="closeDialog" icon="pi pi-times" class="p-button-outlined" :style="{ color: 'red', borderColor: 'red', marginRight: '10px' }" />
                  <Button label="Save" @click="save" icon="pi pi-check" class="p-button-outlined" />
              </div>
          </Dialog>

          <Dialog v-model:visible="deleteCategoryLanguageDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span>Are you sure you want to delete the selected category language?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" style="color: red" text @click="deleteCategoryLanguageDialog = false" />
                    <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedCategory" />
                </template>
          </Dialog>
      </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { Language } from '../../types/types/language';
import { Category } from '../../types/types/categories';
import { useCategoriesStore } from '../../stores/category.store';
import { useApiLanguages } from '../../stores/languagus.store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { useCustomToast } from '../../composables/useToast';



const display = ref(false);
const isEditMode = ref(false);
const loading2 = ref(false);
const categorySearchQuery = ref('');
const categoryInfo = ref<Category[]>([]);
const selectedLangauge = ref(null);
const languages = ref<Language[]>([]);
const selectedCategory = ref();
const deleteCategoryLanguageDialog = ref(false);
const catergoriesStore = useCategoriesStore();
const languagesStore = useApiLanguages();
const first = ref(0);
const rows = ref(10);
const totalRecords = ref(0);
const { showSuccess, showError } = useCustomToast();
const dialogHeader = ref('New Category');

const onPage = (event: any) => {
  first.value = event.first;
  rows.value = event.rows;
  loadPageData();
};

const loadPageData = async () => {

  loading2.value = true;

  setTimeout(async () => {
    try {
      const data = await catergoriesStore.getCategories(first.value.toString(), rows.value.toString());
      categoryInfo.value = data.data;
      totalRecords.value = data.totalCount;
      categoryInfo.value.forEach((category: any) => {
        category.currentLang = 'TH';
      });

    } catch (error) {
      showError(error.message)
    } finally {
      loading2.value = false;
    }
  }, 1000);
};

const open = () => {
  display.value = true;
};

const openCategoryLanguage = async (data: any) => {
  dialogHeader.value = 'New Category Language'
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
  lang_id: null as number | null,
});

const initialFormData = {

  group: '',
  title: '',
  lang_id: null as number | null,
};

const errorMessages = reactive({
  title: '',
  lang_id: null as number | null,
});

const initialErroMessages = {
  title: '',
  lang_id: null as number | null,
};

const resetForm = () => {
  Object.assign(formData, initialFormData);
};

const resetError = () => {
  Object.assign(errorMessages, initialErroMessages);
};

const search = async () => {
  loading2.value = true;

  try {
        if (categorySearchQuery.value === '') {
          const data = await catergoriesStore.getCategories(first.value.toString(), rows.value.toString());
          categoryInfo.value = data.data;
        } else {
            const filteredCategoryInfo = categoryInfo.value.filter(
                (category) => category.title.toLowerCase().includes(categorySearchQuery.value.toLowerCase())
            );
            categoryInfo.value = filteredCategoryInfo;
        }
    } catch (error) {
        console.error('Error searching category:', error);
    } finally {
        loading2.value = false;
    }
};

const save = () => {

  if (!validateForm()) {
      console.log('Form validation failed');
      return;
  }

  formData.lang_id = selectedLangauge.value;
  
  const formDataObject = new FormData();
  
  formDataObject.append('body', JSON.stringify(formData));
  
  if(formData.group) {

    addCategoryLanguage(formDataObject);
  } else {

    isEditMode.value ? updateCategory(formDataObject) : addCategory(formDataObject);
  }
  
  display.value = false;
  
};

const addCategory = async (formDataObject: FormData) => {
  
  try {
       
        const result = await catergoriesStore.createCategory(formDataObject);
        const newCategory = result.data;
        newCategory.currentLang = 'TH';
        categoryInfo.value.push(newCategory);
        console.log(newCategory);
        showSuccess('Category added successfully!');

    } catch (error) {

        console.error('Error while adding category: ', error.message);
        showError(error.message);

    } finally {

    }
};

const addCategoryLanguage = async (formDataObject: FormData) => {

  try {

    const result = await catergoriesStore.createCategoryLanguage(formDataObject);
    
    if(result.status === 400){
        showError(result.message);
        return
    }

    const newCategoryLanguage = result.data;
    newCategoryLanguage.currentLang = 'TH';
        
    const index = categoryInfo.value.findIndex(item => item.group === newCategoryLanguage.group);

    if (index !== -1) {
      categoryInfo.value[index] = newCategoryLanguage;
    } else {

      categoryInfo.value.push(newCategoryLanguage);
    }
        
    showSuccess('Category-language added successfully!');

  } catch (error) {

    console.error('Error while adding category-language: ', error.message);
    showError(error.message);
    
  } finally {
    
  }

};

const updateCategory = async (data: any) => {
  console.log(data);
};

const editCategory = () => {};

const confirmDeleteCategory = async (data: any) => {
  deleteCategoryLanguageDialog.value = true;
  selectedCategory.value = await data;
  
};

const modifyData = async (data: any) => {

  data.newKey = '1';
   return data;
};

const deleteSelectedCategory = async () => {

  if(!selectedCategory) return; 

  try {
    
    const flag = selectedCategory.value.currentLang;
    const index = categoryInfo.value.findIndex(item => item.group === selectedCategory.value.group);
    const result = await catergoriesStore.deleteCategory(selectedCategory)
    
    if(result.status == 'del-cat') {
      if (index !== -1) {
        categoryInfo.value.splice(index, 1);
      }
    }

    if(result.status == 'del-lang') {
      
        if (index !== -1) {
    
          categoryInfo.value[index].languageList = categoryInfo.value[index].languageList.filter(lang => lang !== flag);
          categoryInfo.value[index].languageTitles = categoryInfo.value[index].languageTitles.filter(title => {
          const langIndex = categoryInfo.value[index].languageList.indexOf(title);
          
          return langIndex !== -1;
        });
      
        categoryInfo[index] = {
          ...categoryInfo[index]
        };
      }
    }
   
  } catch (error) {
    showError(error.message);
  } finally {
    deleteCategoryLanguageDialog.value = false;
    showSuccess('Category-language delete successfully!');
  }
};

const filteredCategoryInfo = computed(() => {
  if (categorySearchQuery.value === '') {
    return categoryInfo.value;
  } else {
    
    return categoryInfo.value.filter(
      (category) =>
        category.title.toLowerCase().includes(categorySearchQuery.value.toLowerCase()) ||
        category.group.toLowerCase().includes(categorySearchQuery.value.toLowerCase())
    );
  }
});


onMounted(async () => {
  loading2.value = true;

  setTimeout(async () => {
    try {
      const data = await catergoriesStore.getCategories(first.value.toString(), rows.value.toString());
      categoryInfo.value = data.data;
      categoryInfo.value.forEach((category: any) => {
        category.currentLang = 'TH';
      });
      totalRecords.value = data.totalCount;
      //Get Language 
      const dataLanguage = await languagesStore.getLanguages();
      languages.value = dataLanguage.data
    } catch (error) {
      showError(error.message)
    } finally {
      loading2.value = false;
    }
  }, 1000);
});


const validateForm = () => {
  let isValid = true;
  return isValid;
};


const changeLanguage = (rowData: any, lang: any) => {

  rowData.currentLang = lang;


};

const getTitle = (rowData: any) => {
  
  if (!rowData.languageList || !Array.isArray(rowData.languageList) || !rowData.currentLang) {
    return rowData.title;
  }

  const langIndex = rowData.languageList.indexOf(rowData.currentLang); 
 
  if (langIndex !== -1) {
    return rowData.languageTitles[langIndex]; 
  }

  const fallbackIndex = rowData.languageList.indexOf(rowData.languageList[0]);
  if (fallbackIndex !== -1) {
    return rowData.languageTitles[fallbackIndex];
  }

  return rowData.title; 
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
