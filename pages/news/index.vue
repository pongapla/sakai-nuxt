<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="row">
                    <Toast />
                    <div class="custom-row">
                        <div class="custom-col">
                            <h4 class="text-gray">Management News</h4>
                        </div>
                        <div class="custom-col input-container">
                            <InputText type="text" name="search" placeholder="Search" class="underline-input" v-model="userSearchQuery" />
                            <i class="pi pi-search search-icon" @click="search"></i>
                        </div>
                        <div class="custom-col rigthB">
                            <Button label="Add News" icon="pi pi-plus" severity="success" outlined class="custom-button-size" @click="open" />
                        </div>
                    </div>
                    <!-- DataTable-->
                    <div>
                        <DataTable
                            :value="filteredNewsInfo"
                            scrollable="true"
                            paginator
                            :totalRecords="totalRecords"
                            :lazy="true"
                            :rows="10"
                            :rowsPerPageOptions="[10, 20, 50, 100]"
                            :first="first"
                            @page="onPage"
                            class="mt-3"
                            emptyMessage="No users available."
                            :loading="loading2"
                        >
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { TNews } from '../../types/types/news.type';
import { useNewsStore } from '../../stores/news.store';
import CascadeSelect from 'primevue/cascadeselect';
import { Category } from '../../types/types/categories';
import { useCategoriesStore } from '../../stores/category.store';
import { tryUseNuxtApp } from 'nuxt/app';
import { useCustomToast } from '../../composables/useToast';

const catergoriesStore = useCategoriesStore();
const selectedCategories: any = ref(null);
const categories = ref([
    { name: 'Bangkok', code: '01' },
    { name: 'Japan', code: '02' }
]);

onMounted(async () => {
    try {
        const data = await catergoriesStore.getCategories('0', '100');
        console.log(data.data);
        console.log('>>>>>>>>>>>>');
    } catch (error) {}
});
</script>

<style scoped>
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

.inline-cascadeselect {
    border: none;
    border-bottom: 0.2px solid #ccc;
    border-radius: 0;
    width: 100%;
}

.inline-cascadeselect:hover {
    border-bottom: 0.2px solid #ccc;
    border: none;
}

.inline-cascadeselect:focus {
    border: none;
}

.p-cascadeselect.p-focus {
    --p-focus-ring-color: transparent;
    box-shadow: none;
    border: none;
}
</style>
