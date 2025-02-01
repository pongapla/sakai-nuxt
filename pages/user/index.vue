<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="row">
          <div class="custom-row">
            <div class="custom-col">
              <h4 class="text-gray">Management Users</h4>
            </div>
            <div class="custom-col input-container">
              <InputText type="text" name="search" placeholder="Search" class="underline-input"
                v-model="userSearchQuery" />
              <i class="pi pi-search search-icon" @click="search"></i>
            </div>
            <div class="custom-col rigthB">
              <Button label="Add User" icon="pi pi-plus" severity="success" outlined
                class="custom-button-size" @click="open" />
            </div>
          </div>

          <!-- DataTable -->
          <div>
            <DataTable
              :value="userInfo"
              :scrollable="true"
              :paginator="true"
              :totalRecords="userInfo.length"
              :rows="10"
              scrollHeight="400px"
              class="mt-3"
              emptyMessage="No users available.">
              <Column field="id" header="ID" style="min-width: 50px" frozen></Column>
              <Column field="gender" header="Gender" style="min-width: 200px"></Column>
              <Column field="name" header="Name" style="min-width: 200px" frozen></Column>
              <Column field="userName" header="Username" style="min-width: 200px"></Column>
              <Column field="email" header="Email" style="min-width: 200px"></Column>
              <Column field="phone" header="Phone" style="min-width: 200px"></Column>
              <Column field="is_admin" header="Admin" style="min-width: 200px"></Column>
              <Column field="is_shop" header="Shop" style="min-width: 200px"></Column>
              <Column field="is_editor" header="Editor" style="min-width: 200px"></Column>
              <Column field="picture" header="Picture" style="min-width: 200px" frozen alignFrozen="right"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog for Add/Edit User -->
  <div class="grid">
        <div class="col-12 lg:col-6">
            <Dialog :header="isEditMode ? 'Edit User' : 'New User'" v-model:visible="display"
                :breakpoints="{ '960px': '70vw' }" :style="{ width: '40vw', height: '80vh' }" :modal="true">
                <hr>
                <div style="margin-left: 20px;">
                    <div class="grid align-items-center" style="display: flex; align-items: center;">

                        <h5 style="margin-right: 10px; padding-top: 10px;">User Type :</h5>

                        <div class="col-12 md:col-2">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option1" name="option" value="editor" v-model="formData.is_editor" />
                                <label for="option1">Editor</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option2" name="option" value="admin" v-model="formData.is_admin" />
                                <label for="option2">Admin</label>
                            </div>
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 10px; padding-top: 10px;">Gender :</h5>
                        <div class="col-12 md:col-2">
                            <div class="field-radiobutton mb-0" style="margin-right: 10px;">
                                <RadioButton id="option1" name="option" value="editor" v-model="formData.gender" />
                                <label for="option1">Man</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option2" name="option" value="admin" v-model="formData.gender" />
                                <label for="option2">Female</label>
                            </div>
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 0px; padding-top: 20px;">Username:</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Username" v-model="formData.username"
                                :style="{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0', width: '100%' }" />
                        </div>

                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 0px; padding-top: 20px;">Name:</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Name" v-model="formData.name"
                                :style="{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0', width: '100%' }" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 0px; padding-top: 20px;">Password:</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="password" placeholder="Password" v-model="formData.password"
                                :style="{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0', width: '100%' }" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 0px; padding-top: 20px;">Email:</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="email" placeholder="Email" v-model="formData.email"
                                :style="{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0', width: '100%' }" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 0px; padding-top: 20px;">Phone:</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <InputText type="text" placeholder="Phone" v-model="formData.phone"
                                :style="{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0', width: '100%' }" />
                        </div>
                    </div>
                    <div class="grid align-items-center mt-2" style="display: flex; align-items: center;">
                        <h5 style="margin-right: 0px; padding-top: 20px;">File</h5>
                        <div class="col-12 mb-2 lg:col-8 lg:mb-0">
                            <FileUpload mode="basic" name="userPicture" accept="image/*" :maxFileSize="1000000"
                            @upload="handleFileUpload"  customUpload />
                        </div>
                    </div>

                </div>
                <div class="mt-2" style="text-align: right;">
                    <Button label="Cancel" @click="close" icon="pi pi-times" class="p-button-outlined"
                        :style="{ color: 'red', borderColor: 'red', marginRight: '10px' }" />
                    <Button label="Save" @click="close" icon="pi pi-check" class="p-button-outlined" />
                </div>

            </Dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User } from '../../types/types/user.type';
import { useApiUser } from '../../composables/useApiUser';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload  from 'primevue/fileupload';

const display = ref(false);
const isEditMode = ref(false);
const loading2 = ref(false);
const userSearchQuery = ref('');
const userInfo = ref<User[]>([]);
const file = ref<File | null>(null);
const formData = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  is_admin: false,
  is_shop: false,
  is_editor: false,
  password: '',
  picture: '',
  gender: ''
});

const { getUsers } = useApiUser();

// ฟังก์ชันการค้นหาผู้ใช้
const search = async () => {
  loading2.value = true;
  try {
    // ฟังก์ชันกรองผู้ใช้ตามชื่อ, username หรือ email
    const filteredUsers = userInfo.value.filter(user =>
      user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
      user.userName?.toLowerCase().includes(userSearchQuery.value.toLowerCase())
    );
    userInfo.value = filteredUsers;
  } catch (error) {
    console.error('Error searching users:', error);
  } finally {
    loading2.value = false;
  }
};

// ฟังก์ชันเปิด Dialog
const open = () => {
  display.value = true;
  resetForm();
};

// ฟังก์ชันปิด Dialog
const close = () => {
  display.value = false;
};

// ฟังก์ชันรีเซ็ตรูปแบบข้อมูล
const resetForm = () => {
  formData.value = {
    name: '',
    username: '',
    email: '',
    phone: '',
    is_admin: false,
    is_shop: false,
    is_editor: false,
    password: '',
    picture: '',
    gender: ''
  };
};

// ฟังก์ชันการอัปโหลดไฟล์
const handleFileUpload = (event: any) => {
  const uploadedFile = event.files[0];  // ดึงไฟล์ที่อัปโหลด

  if (uploadedFile) {
    file.value = uploadedFile;  // กำหนดค่าให้ file.value
  } else {
    console.error("No file selected.");
  }
};

const save = () => {
  if (file.value) {
    const formDataObject = new FormData();
    formDataObject.append('file', file.value);  // ส่งไฟล์ไปใน formData
    formDataObject.append('body', JSON.stringify(formData.value));  // ข้อมูลฟอร์มอื่นๆ

    isEditMode.value ? updateUser(formDataObject) : addUser(formDataObject);
    close();
  } else {
    console.error("No file to upload.");
  }
};

// ฟังก์ชันการเพิ่มผู้ใช้
const addUser = (formDataObject) => {
  console.log('Adding user...', formDataObject);
  // เพิ่มข้อมูลผู้ใช้ใน API
};

// ฟังก์ชันการอัปเดตผู้ใช้
const updateUser = (formDataObject) => {
  console.log('Updating user...', formDataObject);
  // อัปเดตข้อมูลผู้ใช้ใน API
};

// ฟังก์ชันดึงข้อมูลผู้ใช้จาก API เมื่อเริ่มต้น
onMounted(async () => {
  try {
    const data = await getUsers();
    if (data && Array.isArray(data.data)) {
      userInfo.value = data.data;
    } else {
      console.error('Users data is not in expected format:', data);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading2.value = false;
  }
});
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
</style>
