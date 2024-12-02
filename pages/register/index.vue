<template>
    <div class="flex items-center justify-center min-h-screen bg-white font-prompt">
        <form @submit.prevent="register" class="card w-full max-w-sm bg-yellow-300 shadow-md">
            <div class="card-body">
                <div class="flex justify-center">
                    <div class="flex">
                        <img src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png" alt="logo"
                            class=" w-16">
                        <div class="flex items-end">
                            <p class="text-2xl font-semibold select-none">สมัครสมาชิก</p>
                        </div>
                    </div>
                </div>

                <div class="form-control select-none">
                    <label class="label flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    ชื่อผู้ใช้งาน
                    </label>
                    <input v-model="username" type="text" placeholder="กรุณากรอกอีเมล" class="input input-bordered" />
                </div>

                <div class="form-control select-none">
                    <label class="label">รหัสผ่าน</label>
                    <input v-model="password" type="password" placeholder="กรุณากรอกรหัสผ่าน"
                        class="input input-bordered" />
                </div>

                <div class="form-control select-none">
                    <label class="label">ยืนยันรหัสผ่าน</label>
                    <input v-model="confirmPassword" type="password" placeholder="กรุณากรอกรหัสผ่าน"
                        class="input input-bordered" />
                </div>

                <div class="form-control mt-4">
                    <button type="submit" class="btn btn-primary">สมัครสมาชิก</button>
                </div>

                <RouterLink to="/login" class=" flex justify-center">
                    <div class="flex justify-center bg-black p-2 rounded-xl">
                        <p class="text-white text-sm select-none">เข้าสู่ระบบ</p>
                    </div>
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

const register = async () => {

    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.');
        return;
    }
    try {
        const response = await $fetch('/api/auth/register', {
            method: 'POST',
            body: { username: username.value, password: password.value, confirmPassword: confirmPassword.value }
        });
        console.log('data : ', response)
        router.push('/login');
    } catch (error) {
        console.log('error', error)
    }
};
</script>

<style scoped>
.font-prompt {
    font-family: 'Prompt', sans-serif !important;
}
.label {
  display: flex;
  align-items: center;
}
.input {
  padding-left: 1rem; /* เพิ่ม padding ทางซ้ายเพื่อไม่ให้ข้อความทับกับไอคอน */
}
</style>