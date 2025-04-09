<script setup>
import { useLayout } from '@/layouts/composables/layout';
import { reactive, ref, computed } from 'vue';
import AppConfig from '@/layouts/AppConfig.vue';
import useAuthStore from '~/stores/auth.store';
import { useApi } from '@/composables/useApi';
import { useCustomToast } from '../../composables/useToast';

const api = useApi();
const  useStore = useAuthStore();
const { layoutConfig } = useLayout();
const modelRef = reactive({
    userName: "",
    password: "",
});
const checked = ref(false);
const { showSuccess, showError } = useCustomToast();
const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
const submit = async () => {
    try {
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }
        
        const result = await  useStore.login(toRaw(modelRef));
        
        if (result.status === 401) {
            
            showError(result.message);
        }
        if (result.status === 'success') {
        
            return navigateTo('/');
        }
    } catch (error) {
        console.log(error);
        showError(error.message);
    }
}; 
definePageMeta({
    layout: false
});
let errorMessages = reactive({
    userName: '',
    password: '',
});
const initialErroMessages = {
    userName: '',
    password: '',
}
const resetError = () => {
    Object.assign(errorMessages, initialErroMessages);
}
const validateForm = () => {
    let isValid = true;

    if (!modelRef.userName) {
        errorMessages.userName = 'Username is required.';
        isValid = false;
    } else if (modelRef.userName.length < 3) {
        errorMessages.userName = 'Username must be more than 2 characters.';
        isValid = false;
    }

    if (!modelRef.password) {
        errorMessages.password = 'Password is required.';
        isValid = false;
    } else if (modelRef.password.length < 6) {
        errorMessages.password = 'Password must be at least 6 characters.';
        isValid = false;
    }
    return isValid;
}

watch(() => [modelRef.userName, modelRef.password], ([newUserName,newPassword]) => {
    if (!newUserName) {
        errorMessages.userName = 'Password is required.';
    } else if (modelRef.userName.length < 3) {
        errorMessages.userName = 'Username must be more than 2 characters.';
    } else {
        errorMessages.userName = '';
    }
    if (!newPassword) {
        errorMessages.password = 'Password is required.';
    } else if (modelRef.password.length < 6) {
        errorMessages.password = 'Password must be at least 6 characters.';
    } else {
        errorMessages.password = '';
    }
});
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, News!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>
                    <Toast />
                    <div>
                        <div>
                            <label for="userName" class="block text-900 text-xl font-medium mb-2">Username</label>
                            <InputText id="userName" v-model="modelRef.userName" type="text" placeholder="Username"
                                class="w-full md:w-30rem mb-2" style="padding: 1rem" />
                            <small v-if="errorMessages.userName" class="p-error block">{{ errorMessages.userName
                                }}</small>
                        </div>

                        <div>
                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password v-model="modelRef.password" placeholder="Password" :toggleMask="true"
                                class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"
                                :feedback="false" variant="filled">
                            </Password>
                            <small v-if="errorMessages.password" class="p-error block">{{ errorMessages.password
                                }}</small>
                        </div>

                        <Button label="Sign In" class="w-full p-3 text-xl mt-3" @click="submit"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
.swal2-confirm .swal2-styled {
    color: green;
}
</style>
