<template>
  <div class="flex flex-col h-full select-none">
    <!-- Mobile Hamburger Menu Button -->
    <button
      class="sm:hidden btn btn-ghost btn-circle fixed top-4 left-4 z-50 p-2 text-black bg-zinc-300"
      @click="toggleMobileNav"
    >
      <!-- Hamburger Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        class="w-6 h-6 hamburger-icon"
        :class="{ 'rotate-90': mobileNavOpen, 'rotate-0': !mobileNavOpen }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Mobile Sidebar (Overlay) -->
    <div
      v-if="mobileNavOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden mobile-menu-overlay"
      :class="{ 'mobile-menu-active': mobileNavOpen }"
      @click="toggleMobileNav"
    >
      <div
        class="absolute left-0 top-0 h-full w-full bg-white p-4 overflow-auto shadow-lg"
        @click.stop
      >
        <!-- Logo -->
        <img
          src="https://www.egat.co.th/home/wp-content/uploads/2021/07/LogoEGAT-TH.png"
          alt="EGAT-LOGO"
          class="w-36 mx-auto mb-4"
        />
        <!-- Mobile Menu -->
        <ul>
          <li v-for="menu in menus" :key="menu.name" class="mb-4">
            <div v-if="menu.items">
              <!-- เมนูหลัก -->
              <div
                @click.stop="toggleMenu(menu.name)"
                class="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-300 rounded-lg"
              >
                <span class="text-gray-700">{{ menu.name }}</span>
                <!-- ไอคอนลูกศร -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :class="openMenu === menu.name ? 'rotate-180' : ''"
                  class="h-5 w-5 transition-transform"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <!-- เมนูย่อย -->
              <ul
                v-if="openMenu === menu.name"
                class="submenu absolute left-0 top-full bg-white shadow-md rounded-lg"
              >
                <li v-for="item in menu.items" :key="item.name" class="mb-2">
                  <RouterLink
                    :to="item.link"
                    class="block py-2 px-4 text-gray-600 hover:bg-gray-200 rounded-lg"
                    @click="setActiveMenu(item.name)"
                  >
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <!-- เมนูปกติ (ไม่มีเมนูย่อย) -->
            <RouterLink
              v-else
              :to="menu.link"
              class="block py-2 px-4 text-gray-700 hover:bg-gray-300 rounded-lg"
            >
              {{ menu.name }}
            </RouterLink>
          </li>
        </ul>
        <!-- Close Button -->
        <button class="text-gray-700 mt-4" @click="toggleMobileNav">ปิดเมนู</button>
      </div>
    </div>

    <div class="flex select-none">
      <!-- Sidebar -->
      <aside
        class="hidden sm:flex fixed w-60 bg-gradient-to-b from-zinc-600 to-zinc-700 h-screen flex-col"
      >
        <!-- Header -->
        <div class="egat-logo-container">
          <img
            src="https://www.egat.co.th/home/wp-content/uploads/2021/07/LogoEGAT-TH.png"
            alt="EGAT-LOGO"
            class="w-36 h-auto"
          />
        </div>
        <!-- Menu Title -->
        <ul class="menu bg-base-200 w-70 mt-0 h-[40px] flex items-center justify-center">
          <h2 class="menu-title font-light text-zinc-900 text-base">menu</h2>
        </ul>

        <!-- เมนู -->
        <div class="pr-2 pl-2 select-none">
          <div v-for="menu in menus" :key="menu.name" class="relative">
            <!-- ตรวจสอบว่ามี link -->
            <div
              v-if="menu.link"
              :class="
                'flex items-center mt-3 p-2 text-white rounded-xl cursor-pointer hover:bg-sky-600 transition-colors duration-200 ' +
                (openMenu === menu.name ? 'bg-sky-600' : 'bg-sky-500')
              "
              @click="setActiveMenu(menu.name)"
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
                class="flex items-center mt-3 p-2 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-600 transition-colors duration-200"
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
                    :class="[
                      'flex items-center mt-2 p-2 rounded-xl cursor-pointer transition duration-300',
                      activeSubMenu === item
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-300',
                    ]"
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
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 mx-auto w-full sm:ml-60 overflow-x-auto overflow-y-hidden select-none"
      >
        <div
          class="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 w-full h-[96px] p-5 shadow-lg flex items-center justify-center"
        >
          <p class="text-5xl font-extrabold text-gray-800 tracking-wider">
            แผนก <span class="text-orange-600">หบย-ช</span>
          </p>
        </div>
        <div class="bg-teal-200 w-full h-10 pt-2 pl-5">
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
            <p class="text-base">{{ activeMenu }}</p>
            <!-- แสดงชื่อเมนูที่เลือก -->
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
import { ref, onMounted, onBeforeUnmount } from "vue";

// ตัวแปรจัดการเมนู
const openMenu = ref(null);
const mobileNavOpen = ref(false); // ควบคุมการเปิด/ปิด Hamburger Menu
const activeSubMenu = ref(null);
const activeMenu = ref("รายการอะไหล่"); // ค่าดีฟอลต์

// ฟังก์ชันอัปเดต activeMenu เมื่อเลือกเมนู
const setActiveMenu = (menuName) => {
  activeMenu.value = menuName;
};
const menus = ref([
  {
    name: "รายการอะไหล่",
    link: "/users/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "เครื่องจักรที่รับผิดชอบ",
    items: [
      { name: "รถบรรทุกเทท้าย(BEML)", link: "/users/usingmotor/BEML" },
      { name: "Hole Digger", link: "/users/usingmotor/HoleDigger" },
      { name: "Foldable Truck Crane", link: "/users/usingmotor/FoldableTruckCrane" },
      { name: "Mobile Crane", link: "/users/usingmotor/MobileCrane" },
      { name: "Volvo(A25)", link: "/users/usingmotor/VolvoA25" },
      { name: "Trailer", link: "/users/usingmotor/Trailer" },
      { name: "รถจักรยาน", link: "/users/usingmotor/Bikemotor" },
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
    items: ["Toyota", "Honda", "Isuzu"],
  },
  {
    name: "ครุภัณฑ์/เครื่องมือ",
    items: [
      { name: "ครุภัณฑ์", link: "/users/crument/curu" },
      { name: "เครื่องมือเครื่องใช้", link: "/users/crument/using" },
      {
        name: "เครื่องมือเครื่องใช้ราคาต่ำกว่า 10,000 บาท",
        link: "/users/crument/using10000",
      },
    ], // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "Oil Analysis",
    link: "/users/sparepartslist", // ใช้ลิงก์แทนเมนูย่อย
  },
  {
    name: "งานเบิกซื้อ",
    link: "/users/buy", // ใช้ลิงก์แทนเมนูย่อย
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

const setActiveSubMenu = (menuName) => {
  activeSubMenu.value = menuName;
};

// ฟังก์ชันเปิด/ปิด Hamburger Menu
const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};

// ฟังก์ชันตรวจจับคลิกนอกเมนูเพื่อปิดเมนูย่อย
const closeMenuOnOutsideClick = (event) => {
  // ตรวจสอบว่าคลิกเกิดขึ้นภายใน Hamburger Menu
  const mobileNav = document.querySelector(".sm:hidden");
  const submenu = mobileNav.querySelector(".submenu");

  // ถ้าคลิกภายนอก Hamburger Menu หรือเมนูย่อย ให้ปิดเมนูย่อย
  if (mobileNav && !mobileNav.contains(event.target)) {
    mobileNavOpen.value = false; // ปิด Hamburger Menu
    openMenu.value = null; // ปิดเมนูย่อย
  } else if (submenu && !submenu.contains(event.target)) {
    // ถ้าคลิกภายนอกเมนูย่อยให้ปิดเมนูย่อย
    openMenu.value = null;
  }
};

// ใช้ onMounted และ onBeforeUnmount เพื่อติดตามและลบ event listener
onMounted(() => {
  document.addEventListener("click", closeMenuOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenuOnOutsideClick);
});
</script>

<style scoped>
* {
  font-family: "Kanit", sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #ff8128, 1px -1px 0 #ff8128, -5px 1px 0 #ff8128,
    1px 1px 0 #ff8128;
}
li {
  transition: all 0.3s ease-in-out;
}

li:hover {
  transform: translateX(5px);
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
  transform: translateY(0);
}
.submenu {
  position: absolute;
  left: 0;
  top: 100%; /* อยู่ด้านล่างของเมนูหลัก */
  background-color: white;
  z-index: 50;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  min-width: 100%;
  opacity: 1;
  transform: none;
  transition: none; /* ปิดเอฟเฟกต์การเปลี่ยนแปลง */
}
.hamburger-icon {
  display: inline-block;
  cursor: pointer;
  color: #1e40af; /* สีเริ่มต้น: น้ำเงินเข้ม (ตามธีมเว็บ) */
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out,
    transform 0.3s ease-in-out 0.1s; /* เพิ่ม delay ที่นี่ */
}

.hamburger-icon:hover {
  color: #f97316; /* สีส้มอ่อนเมื่อ Hover */
  transform: scale(1.1); /* ขยายเล็กน้อย */
}

.hamburger-icon:active {
  color: #ea580c; /* สีส้มเข้มเมื่อกด */
  transform: scale(0.9); /* หดเล็กน้อย */
}
.rotate-90 {
  transform: rotate(90deg);
}

.rotate-0 {
  transform: rotate(0deg);
}
.mobile-menu-overlay {
  opacity: 0;
  transform: translateY(-10%);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.mobile-menu-active {
  opacity: 1;
  transform: translateY(0);
}
/* Menu Title */
.menu-title {
  font-size: 1.25rem;
  text-transform: uppercase;
  font-weight: bold;
  color: #2563eb;
  text-align: center;
  padding: 0; /* ลบ padding เพื่อให้การจัดตำแหน่งทำงานได้แม่นยำ */
  margin: 0; /* ลบ margin เพื่อจัดข้อความให้ตรงกลาง */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* ใช้ความสูงเต็มพื้นที่ของ container */
  line-height: normal; /* ปรับ line-height เพื่อไม่ให้ข้อความดูอัดแน่น */
}
.egat-logo-container {
  height: 6rem; /* ความสูงของกล่อง */
  background: radial-gradient(ellipse, #e5e6dc, #ebd725); /* ไล่สีพื้นหลัง */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
  padding: 10px;
}

.egat-logo-container img {
  width: 9rem; /* ปรับขนาดโลโก้ */
  height: auto;
  border-radius: 10px; /* ขอบโค้งมน */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.egat-logo-container img:hover {
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ Hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* เพิ่มเงาเมื่อ Hover */
}

.egat-logo-container img:active {
  transform: scale(0.95); /* ลดขนาดเล็กน้อยเมื่อกด */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
</style>
