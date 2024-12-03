<template>
    <div class="flex flex-col h-full">
        <div class="sm:p-0 p-2">
            <button class="sm:hidden btn btn-ghost btn-circle p-2 text-black bg-zinc-300" @click="toggleMobileNav">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        <!-- Sidebar for Mobile Navigation -->
        <div v-if="mobileNavOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden"
            @click="toggleMobileNav">
            <div class="absolute left-0 top-0 h-full w-60 bg-white font-kanit p-2 overflow-auto" @click.stop>
                <img class="pr-4 pl-4 pt-4" src="/public/admin/EGAT_LOGO.png" alt="logo" />
                <div class="divider pr-4 pl-4"></div>
                <div class="pr-2 pl-2">
                    <RouterLink to="/admin"
                        class="block py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent">
                        <p class="text-base text-orange-400 ml-2">รายการอะไหล่ </p>
                    </RouterLink>

                    <RouterLink to="/admin"
                        class="block mt-2 py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent">
                        <p class="text-base text-orange-400 ml-2">ไฟล์เอกสาร </p>
                    </RouterLink>

                    

                </div>
            </div>
        </div>

        <div class="flex">
            <!-- Sidebar / Aside -->
            <aside class="w-60 bg-slate-500 rounded-xl h-[600px] hidden sm:block">

                <div class="h-24 bg-zinc-400 flex justify-center items-center select-none">
                    <img src="/public/admin/EGAT_LOGO.png" alt="EGAT-LOGO" class="w-48 h-12">
                </div>



                <div class="pr-2 pl-2">
                    <RouterLink to="/admin/sparepartslist"
                        class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <p class="text-base select-none text-zinc-600 ml-2">รายการอะไหล่ </p>
                    </RouterLink>

                    <RouterLink to="/admin/documentfile"
                        class="flex items-center mb-3 mt-3 p-2 bg-base-100 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <p class="text-base select-none text-zinc-600 ml-2">ไฟล์เอกสาร </p>
                    </RouterLink>

                    <ul class="menu bg-base-100 rounded-box w-70 mt-2">
                        <li>
                            <h2 class="menu-title font-light text-zinc-500 text-center text-base">ข้อมูลภายในเว็บ</h2>
                            <ul>
                                <li>
                                    <RouterLink to="/admin/users" class="">
                                        <p class="text-base ">ข้อมูลยูสเซอร์</p>
                                    </RouterLink>
                                </li>

                            </ul>
                        </li>
                    </ul>

                </div>

                <div class="h-[60%] flex items-end">
                    <div @click="authStore.logout()" class="bg-red-400 w-full h-20 rounded-b-lg cursor-pointer select-none">
                        <div class="flex gap-2 justify-center items-center">
                            <div class="mt-7">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="#ffffff" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>

                            </div>
                            <p class="text-white mt-6">ออกจากระบบ</p>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1 p-4  rounded-xl mx-auto w-full">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
import { LogoutIcon } from "@vue-hero-icons/outline"
import { useAuthStore } from "#build/imports";

const authStore = useAuthStore()

const mobileNavOpen = ref(false);

const toggleMobileNav = () => {
    mobileNavOpen.value = !mobileNavOpen.value;
};

</script>

<style scoped>
* {
    font-family: 'Kanit', sans-serif;
}

.text-stroke {
    text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>