<template>
    <div class="flex items-center justify-center min-h-screen bg-white font-prompt">
        <form @submit.prevent="register" class="card w-full max-w-sm bg-yellow-300 shadow-md">
            <div class="card-body">
                <div class="flex justify-center">
                    <div class="flex">
                        <img src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png" alt="logo"
                            class=" w-16">
                        <div class="flex items-end">
                            <p class="text-2xl font-semibold">สมัครสมาชิก</p>
                        </div>
                    </div>
                </div>

                <div class="form-control">
                    <label class="label">ชื่อผู้ใช้งาน</label>
                    <input v-model="username" type="text" placeholder="กรุณากรอกอีเมล" class="input input-bordered" />
                </div>

                <div class="form-control">
                    <label class="label">รหัสผ่าน</label>
                    <input v-model="password" type="password" placeholder="กรุณากรอกรหัสผ่าน"
                        class="input input-bordered" />
                </div>

                <div class="form-control">
                    <label class="label">ยืนยันรหัสผ่าน</label>
                    <input v-model="confirmPassword" type="password" placeholder="กรุณากรอกรหัสผ่าน"
                        class="input input-bordered" />
                </div>

                <div class="form-control mt-4">
                    <button type="submit" class="btn btn-primary">สมัครสมาชิก</button>
                </div>

                <RouterLink to="/login" class=" flex justify-center">
                    <div class="flex justify-center bg-black p-2 rounded-xl">
                        <p class="text-white text-sm">เข้าสู่ระบบ</p>
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
</style>