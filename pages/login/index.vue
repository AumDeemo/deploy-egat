<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 font-prompt text-white select-none"
  >
    <form
      @submit.prevent="login"
      class="card w-full max-w-lg bg-white text-gray-800 shadow-2xl rounded-xl border-t-8 border-blue-600"
    >
      <div class="card-body p-10">
        <!-- Header -->
        <div class="flex justify-center mb-8">
          <div class="flex items-center space-x-4">
            <img
              src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png"
              alt="EGAT Logo"
              class="w-20 h-20 drop-shadow-lg"
            />
            <p class="text-4xl font-extrabold text-blue-800 tracking-wide">เข้าสู่ระบบ</p>
          </div>
        </div>

        <!-- Form -->
        <div>
          <div class="form-control mb-6">
            <label for="email" class="text-gray-700 font-bold">ID</label>
            <input
              v-model="username"
              type="email"
              id="email"
              placeholder="กรอกอีเมลหรือรหัสพนักงาน"
              class="input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
          </div>
          <div class="form-control mb-6">
            <label for="password" class="text-gray-700 font-bold">รหัสผ่าน</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="กรอกรหัสผ่าน"
              class="input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
            />
            <p v-if="loginError" class="text-red-500 text-sm mt-2">{{ loginError }}</p>
          </div>
          <div class="form-control mt-5">
            <button
              type="submit"
              class="btn btn-accent w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 hover:to-blue-400 shadow-lg py-3 rounded-lg transition-all"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-10 text-center">
          <RouterLink
            to="/users"
            class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition-all"
          >
            ย้อนกลับ
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const username = ref("");
const password = ref("");

const loginError = ref("");
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    });

    authStore.login(response);

    router.push("/admin/sparepartslist");
  } catch (error) {
    console.error("Login failed", error);
    loginError.value = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
};
</script>

<style scoped>
.font-prompt {
  font-family: "Prompt", sans-serif !important;
}

.card {
  border-radius: 1.25rem;
}

.input-bordered {
  transition: all 0.3s;
}

.input-bordered:focus {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
}

.btn {
  transition: transform 0.3s;
}

.btn:hover {
  transform: scale(1.05); /* ขยายปุ่มเพิ่มขึ้น 10% */
  transition: transform 0.2s ease-in-out; /* เพิ่มความลื่นไหล */
}
</style>
