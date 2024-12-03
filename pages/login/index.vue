<template>
    <div class="flex items-center justify-center mt-10 font-prompt">
        <form @submit.prevent="login" class="card w-full max-w-sm bg-yellow-300 shadow-md">
            <div class="card-body">
                <div class="flex justify-center">
                    <div class="flex">
                        <img src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png " alt="logo"
                            class=" w-16">
                        <div class="flex items-end">
                            <p class="text-2xl font-semibold inline-block select-none">เข้าสู่ระบบ</p>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="">
                    <form @submit.prevent="login">
                        <div class="form-control select-none">
                            <label>อีเมล</label>
                            <input v-model="username" type="email" placeholder="กรอกอีเมล" class="input input-bordered" />
                        </div>
                        <div class="form-control mt-5 select-none">
                            <label>รหัสผ่าน</label>
                            <input v-model="password" type="password" placeholder="กรอกรหัสผ่าน" class="input input-bordered" />
                            <p v-if="loginError" class="text-red-500 mt-1">{{ loginError }}</p>
                        </div>
                        <div class="form-control mt-5">
                            <button type="submit" class="btn btn-accent text-white font-light">เข้าสู่ระบบ</button>
                        </div>
                    </form>
                </div>

                <RouterLink to="/register" class=" flex justify-center">
                    <div class="flex justify-center bg-black p-2 rounded-xl">
                        <p class="text-white text-sm select-none">สมัครสมาชิก </p>
                    </div>
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const username = ref('');
const password = ref('');

const loginError = ref('')
const authStore = useAuthStore();


const login = async () => {
    try {
        const response = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                username: username.value,
                password: password.value,
            },
        });

        authStore.login(response);
    } catch (error) {
        console.error('Login failed', error);
        loginError.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    }
};
</script>

<style scoped>
.font-prompt {
    font-family: 'Prompt', sans-serif !important;
}
</style>
