<template>
  <div class="flex flex-col h-full">
    <div class="sm:p-0 p-2">
      <!-- Mobile Menu Button -->
      <button
        class="sm:hidden btn btn-ghost btn-circle p-2 text-black bg-zinc-300"
        @click="toggleMobileNav"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Sidebar for Mobile Navigation -->
    <div
      v-if="mobileNavOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden"
      @click="toggleMobileNav"
    >
      <div
        class="absolute left-0 top-0 h-full w-60 bg-white font-kanit p-2 overflow-auto"
        @click.stop
      >
        <img class="pr-4 pl-4 pt-4" src="/public/admin/EGAT_LOGO.png" alt="logo" />
        <div class="divider pr-4 pl-4"></div>
        <div class="pr-2 pl-2">
          <RouterLink
            to="/admin"
            class="block py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
          >
            <p class="text-base text-orange-400 ml-2">รายการอะไหล่</p>
          </RouterLink>

          <RouterLink
            to="/admin"
            class="block mt-2 py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
          >
            <p class="text-base text-orange-400 ml-2">ไฟล์เอกสาร</p>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="flex select-none overflow-y-hidden">
      <aside
        class="fixed w-60 bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-xl h-screen flex flex-col"
      >
        <!-- Header -->
        <div class="h-24 bg-indigo-200 flex justify-center items-center">
          <img
            src="https://www.egat.co.th/home/wp-content/uploads/2021/07/LogoEGAT-TH.png"
            alt="EGAT-LOGO"
            class="w-36 h-auto"
          />
        </div>
        <!-- Menu Title -->
        <ul class="menu bg-green-200 w-70 mt-0 h-[40px] flex items-center justify-center">
          <h2 class="menu-title font-light text-zinc-900 text-base">menu</h2>
        </ul>

        <!-- เมนู -->
        <div class="pr-2 pl-2 flex-grow overflow-y-auto select-none">
          <div v-for="menu in menus" :key="menu.name" class="relative">
            <!-- ตรวจสอบว่ามี link -->
            <div
              v-if="menu.link"
              :class="
                'flex items-center mt-3 p-2 text-white rounded-xl cursor-pointer transition-colors duration-300 ' +
                (openMenu === menu.name
                  ? 'bg-teal-600 shadow-lg'
                  : 'bg-teal-500 hover:bg-teal-600')
              "
            >
              <a
                :href="menu.link"
                class="block w-full h-full text-base text-white select-none ml-2 flex items-center"
              >
                {{ menu.name }}
              </a>
            </div>

            <!-- เมนูที่มีเมนูย่อย -->
            <div v-else>
              <div
                class="flex items-center mt-3 p-2 bg-teal-500 text-white rounded-xl cursor-pointer transition-colors duration-300 hover:bg-teal-600"
                @click="toggleMenu(menu.name)"
              >
                <p class="text-base select-none ml-2">{{ menu.name }}</p>
                <span class="ml-auto mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :class="openMenu === menu.name ? 'rotate-180' : ''"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </span>
              </div>
              <!-- เมนูย่อย -->
              <div
                v-if="openMenu === menu.name"
                :class="[
                  'absolute left-0 z-10 mt-1 w-full p-4 bg-white border border-gray-300 rounded-xl shadow-md',
                  'menu-sub',
                  openMenu === menu.name ? 'menu-sub-active' : '',
                ]"
              >
                <ul>
                  <li
                    v-for="item in menu.items"
                    :key="item"
                    class="flex items-center mt-2 p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-teal-200 transition duration-300"
                  >
                    <RouterLink
                      :to="item.link"
                      class="block w-full h-full text-base ml-2"
                      @click="setActiveSubMenu(item.name)"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มออกจากระบบ -->
        <div
          @click="authStore.logout()"
          class="logout-button bg-red-400 h-20 cursor-pointer flex justify-center items-center select-none mt-auto"
        >
          <div class="flex gap-2 justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#ffffff"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <p class="text-white text-base">ออกจากระบบ</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 mx-auto w-screen ml-60 overflow-x-auto overflow-y-hidden select-none"
      >
        <div
          class="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 w-full h-[96px] p-5 shadow-lg flex items-center justify-center"
        >
          <p class="text-5xl font-extrabold text-gray-800 tracking-wider">
            แผนก <span class="text-orange-600">หบย-ช</span>
          </p>
        </div>
        <div class="bg-lime-200 w-full h-10 pt-2 pl-5">
          <div class="flex gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.867 19.125h.008v.008h-.008v-.008Z"
                />
              </svg>
            </div>
            <p class="text-base">รายการอะไหล่</p>
          </div>
        </div>
        <div class="p-4 overflow-x-auto overflow-y-hidden h-[calc(100vh-160px)]">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LogoutIcon } from "@vue-hero-icons/outline";
import { useAuthStore } from "#build/imports";
import { ref } from "vue";

// ตัวแปรจัดการเมนู
const openMenu = ref(null);

const menus = ref([
  {
    name: "รายการอะไหล่",
    link: "/admin/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "เครื่องจักรที่รับผิดชอบ",
    items: [
      { name: "รถบรรทุกเทท้าย(BEML)", link: "/admin/usingmotor/BEML" },
      { name: "Hole Digger", link: "/admin/usingmotor/HoleDigger" },
      { name: "Foldable Truck Crane", link: "/admin/usingmotor/FoldableTruckCrane" },
      { name: "Mobile Crane", link: "/admin/usingmotor/MobileCrane" },
      { name: "Volvo(A25)", link: "/admin/usingmotor/VolvoA25" },
      { name: "Trailer", link: "/admin/usingmotor/Trailer" },
      { name: "รถจักรยาน", link: "/admin/usingmotor/Bikemotor" },
    ],
  },
  {
    name: "Fork-Lift",
    items: [
      { name: "Fork-Lift A", link: "" },
      { name: "Fork-Lift B", link: "" },
    ],
  },
  {
    name: "รถยนต์บริการ",
    items: [
      { name: "Toyota", link: "" },
      { name: "Honda", link: "" },
      { name: "Isuzu", link: "" },
    ],
  },
  {
    name: "ครุภัณฑ์และเครื่องมือเครื่องใช้",
    link: "/users/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "Oil Analysis",
    link: "/users/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "งานเบิกซื้อ",
    link: "/users/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "งานเบิกจ้าง",
    link: "/users/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
]);
// ฟังก์ชันเปิด/ปิดเมนู
const toggleMenu = (menuName) => {
  openMenu.value = openMenu.value === menuName ? null : menuName;
};

const authStore = useAuthStore();

const activeSubMenu = ref(null);

const setActiveSubMenu = (menuName) => {
  activeSubMenu.value = menuName;
};
</script>

<style scoped>
* {
  font-family: "Kanit", sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #ff8128, 1px -1px 0 #ff8128, -5px 1px 0 #ff8128,
    1px 1px 0 #ff8128;
}
.pr-2.pl-2 {
  max-height: 500px;
  overflow-y: auto; /* เปิดการเลื่อนในแกน Y */
  overflow-x: hidden; /* ปิดการเลื่อนในแกน X */
}
.logout-button {
  transition: all 0.3s ease-in-out;
}

.logout-button:hover {
  background-color: #b91c1c; /* สีแดงเข้มขึ้น */
  transform: scale(1); /* ขยายขนาด */
}

.logout-button:active {
  transform: scale(0.95); /* ลดขนาดเมื่อกด */
}
/* สำหรับเมนูย่อย */
.menu-sub {
  opacity: 0;
  transform: translateY(-20px); /* เลื่อนขึ้นเล็กน้อย */
  transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out; /* เอฟเฟกต์ช้า */
  max-height: 210px; /* กำหนดความสูงสูงสุดของเมนูย่อย */
  overflow-y: auto; /* เปิดการเลื่อนในแกน Y */
  border-radius: 8px; /* ปรับมุมให้โค้ง */
  padding: 8px; /* เพิ่มระยะห่างในเมนูย่อย */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* เพิ่มเงา */

  /* ซ่อน scrollbar */
  scrollbar-width: none; /* สำหรับ Firefox */
  -ms-overflow-style: none; /* สำหรับ Internet Explorer */
}
.menu-sub::-webkit-scrollbar {
  display: none; /* สำหรับ Chrome, Safari และ Edge */
}

/* เมื่อเมนูย่อยเปิด */
.menu-sub-active {
  opacity: 1;
  transform: translateY(0); /* กลับมาที่ตำแหน่งเดิม */
}
li {
  transition: all 0.3s ease-in-out;
}

li:hover {
  transform: translateX(5px);
}
</style>
