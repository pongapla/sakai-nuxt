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
                            paginator
                            :totalRecords="totalRecords"
                            :lazy="true"
                            :rows="10"
                            :rowsPerPageOptions="[10, 20, 50, 100]"
                            :first="first"
                            @page="onPage"
                            class="mt-3"
                            emptyMessage="No categories available."
                            :loading="loading2"
                        >
                            <Column field="title" header="Title" style="width: 300px; display: flex; justify-content: center"></Column>
                            <Column field="language" header="Language" style="width: 600px; text-align: center"></Column>
                            <Column field="action" header="Action" style="width: 00px; text-align: center">
                                <template #body="slotProps">
                                    <div class="flex justify-content-center">
                                      <!-- ปุ่มบวก (เพิ่มข้อมูล) -->
                                      <Button icon="pi pi-plus" outlined rounded class="ml-2" @click="addCategory(slotProps.data)" />  
                                      <!-- ปุ่มสำหรับแก้ไข -->
                                      <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
                                      <!-- ปุ่มสำหรับลบ -->
                                      <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategory(slotProps.data)" />
                                    </div>
                                </template>
                            </Column>
                            <Column field="" header="Delete" style="min-width: 200px; text-align: center" frozen alignFrozen="right"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialog for Add/Edit Category -->
    <div class="grid">
        <div class="col-12 lg:col-6">
            <Dialog :header="isEditMode ? `Edit Category` : 'New Category'" v-model:visible="display" :breakpoints="{ '960px': '70vw' }" :style="{ width: '40vw', height: '85vh' }" :modal="true" @hide="closeDialog">
                <hr />
                <div style="margin-left: 20px">
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Title :</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Username" v-model="formData.title" class="custom-input" />
                            <small v-if="errorMessages.title" class="p-error">{{}}</small>
                        </div>
                    </div>
                </div>
                <div class="mt-2" style="text-align: right">
                    <Button label="Cancel" @click="closeDialog" icon="pi pi-times" class="p-button-outlined" :style="{ color: 'red', borderColor: 'red', marginRight: '10px' }" />
                    <Button label="Save" @click="save" icon="pi pi-check" class="p-button-outlined" />
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { Categories } from '../../types/types/categories';
import { useCategoriesStore } from '../../stores/category.store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { useCustomToast } from '../../composables/useToast';

const display = ref(false);
const isEditMode = ref(false);
const loading2 = ref(false);
const categorySearchQuery = ref('');
const categoryInfo = ref<Categories[]>([]);
const category = ref({});
const deleteUserDialog = ref(false);
const catergoriesStore = useCategoriesStore();
const first = ref(0);
const rows = ref(10);
const totalRecords = ref(0);
const { showSuccess, showError } = useCustomToast();

const onPage = (event: any) => {
    first.value = event.first;
    rows.value = event.rows;
    loadPageData();
};

const loadPageData = async () => {
    loading2.value = true;
};

const open = () => {
    display.value = true;
};

const closeDialog = () => {
    display.value = false;
    isEditMode.value = false;
    resetForm();
    resetError();
};

const formData = reactive({
    cate_id: '',
    title: '',
    lang_id: ''
});

const initialFormData = {
    cate_id: '',
    title: '',
    lang_id: ''
};

const errorMessages = reactive({
    title: '',
    lang_id: ''
});

const initialErroMessages = {
    title: '',
    lang_id: ''
};

const resetForm = () => {
    Object.assign(formData, initialFormData);
};

const resetError = () => {
    Object.assign(errorMessages, initialErroMessages);
};

const search = async () => {
    loading2.value = true;
};

const save = () => {
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }
};

const addCategory = async (formDataObject: any) => {};

const updateCategory = async (formDataObject: any) => {};

const editCategory = (user: any) => {};

const confirmDeleteCategory = (user: any) => {};

const deleteSelectedCategory = async (user: any) => {};

const filteredCategoryInfo = computed(() => {
    const filteredData = categoryInfo.value.filter((category: any) => {

        const titleInThai = category.languages.find((lang: any) => lang.flag === 'TH');
        
        const title = titleInThai ? titleInThai.name : '';
        
        return title.toLowerCase().includes(categorySearchQuery.value.toLowerCase());
    });
    
    return filteredData;
});


onMounted(async () => {
  
    loading2.value = true;

    setTimeout(async () => {

      try {
        
        const data = await catergoriesStore.getCategories(first.value.toString(),rows.value.toString());
        categoryInfo.value = data.data;
        
      } catch (error) {
        console.error('Error fetching catogories:', error);
      } finally {
        loading2.value = false;
      }

    },1000)
});

const validateForm = () => {
    let isValid = true;
    return isValid;
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
</style>
