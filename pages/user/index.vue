<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="row">
                    <Toast />
                    <div class="custom-row">
                        <div class="custom-col">
                            <h4 class="text-gray">Management Users</h4>
                        </div>
                        <div class="custom-col input-container">
                            <InputText type="text" name="search" placeholder="Search" class="underline-input" v-model="userSearchQuery" />
                            <i class="pi pi-search search-icon" @click="search"></i>
                        </div>
                        <div class="custom-col rigthB">
                            <Button label="Add User" icon="pi pi-plus" severity="success" outlined class="custom-button-size" @click="open" />
                        </div>
                    </div>

                    <!-- DataTable -->
                    <div>
                        <DataTable :value="filteredUserInfo" :scrollable="true" :paginator="true" :totalRecords="userInfo.length" :rows="10" class="mt-3" emptyMessage="No users available." :loading="loading2">
                            <Column field="id" header="ID" style="min-width: 50px" frozen></Column>
                            <Column field="gender" header="Gender" style="min-width: 200px"></Column>
                            <Column field="name" header="Name" style="min-width: 200px" frozen></Column>
                            <Column field="userName" header="Username" style="min-width: 200px"></Column>
                            <Column field="email" header="Email" style="min-width: 200px"></Column>
                            <Column field="phone" header="Phone" style="min-width: 200px"></Column>
                            <Column field="is_registrant" header="Registrant" style="min-width: 200px"></Column>
                            <Column field="is_shop" header="Shop" style="min-width: 200px"></Column>
                            <Column field="is_admin" header="Admin" style="min-width: 200px"></Column>
                            <Column field="is_editor" header="Editor" style="min-width: 200px"></Column>
                            <Column field="picture" header="Picture" style="min-width: 200px">
                                <template #body="slotProps">
                                    <img :src="slotProps.data.picture ? `/images/users/${slotProps.data.picture}` : '/images/users/no-image-icon.png'" :alt="slotProps.data.image" class="w-24 rounded" width="60" height="50" />
                                </template>
                            </Column>
                            <Column field="action" header="Action" style="width: auto; text-align: center" frozen alignFrozen="right">
                                <template #body="slotProps">
                                    <div class="flex justify-content-center">
                                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialog for Add/Edit User -->
    <div class="grid">
        <div class="col-12 lg:col-6">
            <Dialog :header="isEditMode ? `Edit User` : 'New User'" v-model:visible="display" :breakpoints="{ '960px': '70vw' }" :style="{ width: '40vw', height: '80vh' }" :modal="true" @hide="closeDialog">
                <hr />
                <div style="margin-left: 20px">
                    <div class="grid align-items-center" style="display: flex; align-items: center">
                        <h5 style="margin-right: 10px; padding-top: 10px">User Type :</h5>

                        <div class="col-12 md:col-3">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="registrant" name="option" :value="true" v-model="formData.is_registrant" @change="toggleUserType('registrant')" />
                                <label for="registrant">Registrant</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="shop" name="option" :value="true" v-model="formData.is_shop" @change="toggleUserType('shop')" />
                                <label for="shop">Shop</label>
                            </div>
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 10px; padding-top: 10px">Gender :</h5>
                        <div class="col-12 md:col-2">
                            <div class="field-radiobutton mb-0" style="margin-right: 10px">
                                <RadioButton id="man" name="option1" value="man" v-model="formData.gender" />
                                <label for="man">Man</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="female" name="option1" value="female" v-model="formData.gender" />
                                <label for="female">Female</label>
                            </div>
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Username :</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Username" v-model="formData.userName" class="custom-input" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Name :</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Name" v-model="formData.name" class="custom-input" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Password :</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText :disabled="isEditMode" type="password" placeholder="Password" v-model="formData.password" class="custom-input" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Email :</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="email" placeholder="Email" v-model="formData.email" class="custom-input" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">Phone :</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Phone" v-model="formData.phone" class="custom-input" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center">
                        <h5 style="margin-right: 0px; padding-top: 20px">File</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <FileUpload ref="fileupload" mode="basic" name="picture" accept="image/*" :maxFileSize="1000000" @select="onUpload" />
                        </div>
                    </div>
                </div>
                <div class="mt-2" style="text-align: right">
                    <Button label="Cancel" @click="closeDialog" icon="pi pi-times" class="p-button-outlined" :style="{ color: 'red', borderColor: 'red', marginRight: '10px' }" />
                    <Button label="Save" @click="save" icon="pi pi-check" class="p-button-outlined" />
                </div>
            </Dialog>

            <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="user">Are you sure you want to delete the selected user?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" style="color: red" text @click="deleteUserDialog = false" />
                    <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedUser" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { User } from '../../types/types/user.type';
import { useUserStore } from '../../stores/user.store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import { useCustomToast } from '../../composables/useToast';

const display = ref(false);
const isEditMode = ref(false);
const loading2 = ref(false);
const userSearchQuery = ref('');
const userInfo = ref<User[]>([]);
const user = ref({});
const deleteUserDialog = ref(false);
const userStore = useUserStore();
const files = ref<File[]>([]);
const { showSuccess, showError } = useCustomToast();


const formData = reactive({
    id: '',
    name: '',
    userName: '',
    email: '',
    phone: '',
    is_registrant: false,
    is_shop: false,
    is_admin: false,
    is_editor: false,
    password: '',
    picture: null as any,
    gender: ''
});
const initialFormData = {
    id: '',
    name: '',
    userName: '',
    email: '',
    phone: '',
    is_registrant: false,
    is_shop: false,
    is_admin: false,
    is_editor: false,
    password: '',
    picture: null,
    gender: ''
};

const resetForm = () => {
    Object.assign(formData, initialFormData);
};


const search = async () => {
    loading2.value = true;

    try {
        if (userSearchQuery.value === '') {
            const data = await userStore.getUsers();
            userInfo.value = data.data;
        } else {
            const filteredUsers = userInfo.value.filter(
                (user) => user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) || user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase()) || user.userName?.toLowerCase().includes(userSearchQuery.value.toLowerCase())
            );
            userInfo.value = filteredUsers;
        }
    } catch (error) {
        console.error('Error searching users:', error);
    } finally {
        loading2.value = false;
    }
};


const open = () => {
    display.value = true;
};


const closeDialog = () => {

    display.value = false;
    isEditMode.value = false;
    resetForm();
};


const onUpload = (event) => {

    files.value = event.files;
};

const save = () => {
    const formDataObject = new FormData();

    if (files.value && files.value.length > 0) {
        formDataObject.append('file', files.value[0]);
        formData.picture = files.value[0].name;
    } else {
        formData.picture = null;
    }

    formDataObject.append('body', JSON.stringify(formData));

    isEditMode.value ? updateUser(formDataObject) : addUser(formDataObject);

    display.value = false;
};

const addUser = async (formDataObject: any) => {
  console.log(formDataObject);console.log('>>>>>>>');
    try {
        const result = await userStore.createUser(formDataObject);
        userInfo.value.push(result.data);
        showSuccess('User added successfully!');
    } catch (error) {

        console.error('Error while adding user: ', error.message);
        showError(error.message);

    } finally {

    }
};

const updateUser = async (formDataObject: any) => {

    try {
        const result = await userStore.updateUser(formDataObject);
        const updatedUser = result.data;
        const index = userInfo.value.findIndex((user) => user.id === updatedUser.id);

        if (index !== -1) {
            userInfo.value[index] = updatedUser;
        }
    } catch (error) {

        console.error('Error while update user: ', error.message);
        showError(error.message);

    } finally {

        showSuccess('User update successfully!');

    }
};

const editUser = (user: any) => {

    Object.assign(formData, user);

    isEditMode.value = true;
    open();
};

const confirmDeleteUser = (user: any) => {

    deleteUserDialog.value = true;
    deleteSelectedUser(user);

};

const deleteSelectedUser = async (user: any) => {

    try {

        deleteUserDialog.value = false;
        const result = await userStore.deleteUser(user.id);

    } catch (error) {

        showError(error.message);

    } finally {

        showSuccess('User delete successfully!');

    }
};

const filteredUserInfo = computed(() => {

    return userInfo.value.filter(
        (user) => user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) || user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase()) || user.userName?.toLowerCase().includes(userSearchQuery.value.toLowerCase())
    );

});


onMounted(async () => {

    try {

        const data = await userStore.getUsers();
        userInfo.value = data.data;

        
    } catch (error) {

        console.error('Error fetching users:', error);

    } finally {

        loading2.value = false;

    }
});

const toggleUserType = (type) => {

    if (type === 'registrant') {
        formData.is_shop = false;
    }

    if (type === 'shop') {
        formData.is_registrant = false;
    }
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
