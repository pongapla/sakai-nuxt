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
                              class="custom-button-size" />
                      </div>
                  </div>
                  <div>
                      <DataTable
                          :value="userInfo"
                          :scrollable="true" 
                          :paginator="true" scrollHeight="400px"
                          :loading="loading2" scrollDirection="both" class="mt-3">
                          <Column field="id" header="ID" style="min-width: 50px" frozen></Column>
                          <Column field="name" header="Name" style="min-width: 200px" frozen></Column>
                          <Column field="userName" header="userName" style="min-width: 200px"></Column>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserDto } from '../../types/dtos/user/user.dot';
import {useApiUser } from '../../composables/useApiUser';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// การตั้งค่าเริ่มต้น
const loading2 = ref(false); // กำหนดสถานะการโหลดข้อมูล
const userSearchQuery = ref(''); // สำหรับการค้นหาผู้ใช้
const userInfo = ref<UserDto[]>([]); // เก็บข้อมูลผู้ใช้
const { getUsers } = useApiUser();

// ฟังก์ชั่นในการค้นหาผู้ใช้
const search = async () => {
loading2.value = true; // เมื่อเริ่มค้นหาจะตั้งให้สถานะโหลดข้อมูลเป็น true

}


onMounted(async () => {
  try {

    const data = await getUsers();
    
    // ตรวจสอบว่า data มีฟิลด์ 'data' และเป็นอาร์เรย์
    if (data && Array.isArray(data.data)) {
      
      userInfo.value = data.data; // ถ้าเป็นอาร์เรย์ให้เก็บข้อมูลใน userInfo
    } else {
      console.error('Users data is not in expected format:', data);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading2.value = false; // ปิดสถานะ loading
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
