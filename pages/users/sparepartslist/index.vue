<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted, computed } from "vue";
import Fuse from "fuse.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const materials = ref([]);
const searchQuery = ref(""); // เก็บค่าคำค้นหา
const selectedCategory = ref([]); // เก็บหมวดหมู่ที่เลือก
const categories = ref([]); // รายการหมวดหมู่ทั้งหมด
const isCategoryDropdownOpen = ref(false); // เปิด-ปิด dropdown หมวดหมู่
const categoryDropdownRef = ref(null); // สำหรับอ้างอิง dropdown หมวดหมู่
const lowStockMaterials = ref([]); // รายการอะไหล่ที่ต้องแจ้งเตือน
const isNotificationOpen = ref(false); // สถานะเปิด/ปิดการแจ้งเตือน
const notificationDropdownRef = ref(null); // อ้างอิง dropdown แจ้งเตือน
const isImageModalOpen = ref(false); // สถานะเปิด/ปิดโมดอล
const modalImageUrl = ref(""); // เก็บ URL ของรูปภาพที่เลือก
const currentPage = ref(1); // หน้าปัจจุบัน
const itemsPerPage = ref(10); // จำนวนรายการต่อหน้า
const isSearchModalOpen = ref(false); // สถานะเปิด/ปิด modal ค้นหา

const fuseOptions = {
  keys: ["name", "partnumber", "category"], // ฟิลด์ที่ต้องการค้นหา
  threshold: 0.5, // ระดับความคลาดเคลื่อน (0 = ตรงทั้งหมด, 1 = ยอมรับได้ทุกระดับ)
  includeScore: true, // แสดงคะแนนความตรง
};

// ฟังก์ชันสำหรับการเน้นคำค้นหา
const highlightSearch = (text) => {
  if (!searchQuery.value.trim()) return text; // ถ้า searchQuery ว่าง ให้คืนค่า text ปกติ
  const regex = new RegExp(`(${searchQuery.value})`, "gi"); // ใช้คำค้นหาเป็น Regular Expression
  return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>'); // ใช้ <mark> เพื่อไฮไลท์
};

const closeSearchModal = () => {
  isSearchModalOpen.value = false; // ปิด modal
};
const fuse = new Fuse(materials.value, fuseOptions);
fuse.setCollection(materials.value); // ตั้งค่า index ใหม่เมื่อ materials เปลี่ยน

const searchedMaterials = computed(() => {
  if (!searchQuery.value.trim()) {
    return []; // คืนค่า array ว่างหาก searchQuery เป็นช่องว่าง
  }

  const fuse = new Fuse(materials.value, fuseOptions); // สร้างอินสแตนซ์ Fuse
  const results = fuse.search(searchQuery.value.trim()); // ค้นหา

  return results.map((result) => result.item); // ดึงเฉพาะรายการที่ตรง
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    // ถ้า searchQuery ว่างหรือเป็นช่องว่างเปล่า แสดงแจ้งเตือน
    toast.info("กรุณากรอกคำค้นหาก่อน", {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    return;
  }
  isSearchModalOpen.value = true; // เปิด Modal ถ้ามีค่าการค้นหา
};
// คำนวณจำนวนหน้าทั้งหมด
const totalPageCount = computed(() =>
{// คำนวณจำนวนหน้าจาก filteredMaterials
  return Math.ceil(filteredMaterials.value.length / (itemsPerPage.value || filteredMaterials.value.length));}
);


const visiblePages = computed(() => {
  const maxVisible = 4; // จำนวนหน้าที่จะแสดงพร้อมกัน
  const pages = [];


  // คำนวณช่วงของหน้า
  const startPage = Math.max(
    1,
    Math.min(
      currentPage.value - Math.floor(maxVisible / 2),
      totalPageCount.value - maxVisible + 1
    )
  );
  const endPage = Math.min(totalPageCount.value, startPage + maxVisible - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// คำนวณรายการในหน้าปัจจุบัน
const paginatedMaterials = computed(() => {
  const filtered = filteredMaterials.value; // 
  const startIndex = (currentPage.value - 1) * (itemsPerPage.value || filtered.length);
  const endIndex = itemsPerPage.value ? startIndex + itemsPerPage.value : filtered.length;
  return filtered.slice(startIndex, endIndex);
});

// ฟังก์ชันเปิดโมดอลแสดงรูปภาพ
const openImageModal = (imageUrl) => {
  modalImageUrl.value = imageUrl;
  isImageModalOpen.value = true;
};

// ฟังก์ชันปิดโมดอลแสดงรูปภาพ
const closeImageModal = () => {
  modalImageUrl.value = "";
  isImageModalOpen.value = false;
};

// ตรวจสอบรายการอะไหล่ที่ต้องแจ้งเตือน
const checkLowStock = () => {
  lowStockMaterials.value = materials.value.filter(
    (material) => material.totalAmount < 10
  );
};

// เปิด/ปิดการแจ้งเตือน
const toggleNotification = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
};
// ฟังก์ชันเปิด-ปิด dropdown หมวดหมู่
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
};

// ฟังก์ชันปิด dropdown เมื่อคลิกนอกพื้นที่
const handleClickOutsideNotification = (event) => {
  if (
    notificationDropdownRef.value && // ตรวจสอบว่า dropdown ถูก mount แล้ว
    notificationDropdownRef.value.contains(event.target) // ถ้าคลิกใน dropdown
  ) {
    return; // ไม่ปิดแจ้งเตือน
  }
  isNotificationOpen.value = false; // ปิดแจ้งเตือน
};

// ฟังก์ชันปิด dropdown เมื่อคลิกนอกพื้นที่
const handleClickOutsideCategory = (event) => {
  if (
    categoryDropdownRef.value && // ตรวจสอบว่า dropdown ถูก mount แล้ว
    !categoryDropdownRef.value.contains(event.target) // ตรวจสอบว่าคลิกนอกพื้นที่ dropdown
  ) {
    isCategoryDropdownOpen.value = false; // ปิด dropdown
  }
};
// เพิ่ม Event Listener เมื่อคอมโพเนนต์ถูก mounted
onMounted(() => {
  window.addEventListener("click", handleClickOutsideCategory);
  window.addEventListener("click", handleClickOutsideNotification);
});

// ลบ Event Listener เมื่อคอมโพเนนต์ถูก unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideCategory);
  window.removeEventListener("click", handleClickOutsideNotification);
});
// ฟังก์ชันดึงข้อมูลวัสดุจาก API
const fetchMaterials = async () => {
  try {
    const response = await fetch("/api/admin/material", {
      method: "GET",
    });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    materials.value = await response.json();

    // อัปเดตรายการอะไหล่ที่ต้องแจ้งเตือน
    checkLowStock();
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
  }
};
// ดึงข้อมูลหมวดหมู่
const fetchCategories = async () => {
  try {
    const response = await fetch("/api/admin/new/category");
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data;
    } else {
      console.error("Error fetching categories:", result.message);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

// กรองวัสดุตามหมวดหมู่และคำค้นหา
const filteredMaterials = computed(() => {
  let filtered = materials.value;

  if (selectedCategory.value.length > 0) {
    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || [];
      return selectedCategory.value.some((cat) =>
        materialCategories
          .map((c) => c.trim().toLowerCase())
          .includes(cat.trim().toLowerCase())
      );
    });
  }

  return filtered;
});

// ดึงข้อมูลวัสดุเมื่อ component ถูก mounted
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchMaterials()]);
});
</script>

<template>
  <div class="absolute top-4 right-4 z-50 cursor-pointer">
    <button
      class="p-2 bg-rose-600 rounded-full shadow-lg hover:bg-rose-700"
      @click="toggleNotification"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="yellow"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    </button>
  </div>
  <!-- Notification Icon -->
  <div class="absolute top-4 right-4 z-50 cursor-pointer" ref="notificationDropdownRef">
    <button
      class="p-2 bg-rose-600 rounded-full shadow-lg hover:bg-rose-700"
      @click="toggleNotification"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        class="size-6"
      >
        <path
          fill-rule="evenodd"
          d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <div
    v-if="isNotificationOpen"
    class="absolute top-16 right-4 bg-white shadow-lg rounded-xl p-5 w-96 z-50 max-h-96 overflow-y-auto transform transition-all duration-300 select-none"
    style="animation: fadeIn 0.3s ease"
    @click.stop
  >
    <h3 class="text-lg font-bold mb-4 text-blue-600 border-b pb-2 text-center">
      🔔 รายการแจ้งเตือน
    </h3>
    <ul>
      <li
        v-for="material in lowStockMaterials"
        :key="material.id"
        class="flex justify-between items-center p-3 mb-3 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md rounded-lg hover:shadow-lg hover:scale-105 transform transition duration-300"
      >
        <div class="flex-1 text-left">
          <!-- ปรับ flex-1 และ text-left -->
          <h4 class="text-sm font-medium text-gray-800 mb-1">
            {{ material.name }}
          </h4>
          <p class="text-xs text-gray-500">
            คงเหลือ:
            <span
              :class="{
                'text-red-600 font-bold': material.totalAmount <= 5,
                'text-yellow-700 font-medium':
                  material.totalAmount > 5 && material.totalAmount <= 10,
              }"
            >
              {{ material.totalAmount }}
            </span>
          </p>
        </div>
        <div
          class="rounded-full bg-red-100 p-2 flex justify-center items-center shadow-md"
          :class="{
            'bg-red-200': material.totalAmount <= 5,
            'bg-yellow-200': material.totalAmount > 5 && material.totalAmount <= 10,
          }"
        >
          <span
            class="text-red-600 font-bold"
            :class="{
              'text-red-600': material.totalAmount <= 5,
              'text-yellow-600': material.totalAmount > 5 && material.totalAmount <= 10,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </div>
      </li>
    </ul>
    <p v-if="lowStockMaterials.length === 0" class="text-center text-gray-500">
      ไม่มีรายการแจ้งเตือน
    </p>
  </div>

  <userLayouts>
    <!-- ช่องค้นหา -->
    <div class="search-bar-container">
      <div class="search-bar">
        <!-- ไอคอนค้นหา -->
        <span class="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="search-icon-svg"
          >
            <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <!-- ช่องค้นหา -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา..."
          class="search-input"
          @keydown.enter="handleSearch"
        />
        <!-- ปุ่มเปิด Modal -->
        <button @click="handleSearch" class="search-button">ค้นหา</button>
      </div>
    </div>
    <!-- Modal แสดงผลการค้นหา -->
    <div
      v-if="isSearchModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      @click.self="closeSearchModal"
    >
      <!-- ปุ่มปิด Modal -->
      <button
        class="absolute top-4 right-4 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110"
        @click="closeSearchModal"
      >
        ✕
      </button>
      <div
        class="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-lg shadow-2xl overflow-y-auto"
      >
        <!-- ตารางข้อมูล -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="p-4">
            <h2 class="text-2xl font-bold mb-4 text-center text-blue-600">
              ผลลัพธ์การค้นหา
            </h2>
            <!-- ช่องพิมพ์ค้นหาภายใน Modal -->
            <div class="flex justify-center items-center mb-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="พิมพ์เพื่อค้นหา..."
                class="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- จำนวนรายการที่พบ -->
            <div class="text-gray-600 text-center mb-4">
              พบ {{ searchedMaterials.length }} รายการที่ตรงกับการค้นหา
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <div class="overflow-y-auto">
                <div class="table-container max-h-96">
                  <table class="table w-full border-collapse border border-gray-300">
                    <thead>
                      <tr class="bg-orange-400 text-black">
                        <th class="p-3 border border-gray-300">ลำดับ</th>
                        <th class="p-3 border border-gray-300">รูปภาพ</th>
                        <th class="p-3 border border-gray-300">รายการ</th>
                        <th class="p-3 border border-gray-300">PART NUMBER</th>
                        <th class="p-3 border border-gray-300">คงเหลือ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in searchedMaterials"
                        :key="item.id"
                        class="hover:bg-blue-50"
                      >
                        <th data-label="ลำดับ">
                          {{ index + 1 }}
                        </th>
                        <td data-label="รูปภาพ">
                          <img
                            v-if="item.imageUrl"
                            :src="item.imageUrl"
                            alt="Material Image"
                            class="h-16 w-16 object-cover rounded-md mx-auto cursor-pointer"
                            @click="openImageModal(item.imageUrl)"
                          />
                          <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                        </td>
                        <td data-label="รายการ">
                          <span v-html="highlightSearch(item.name)"></span>
                        </td>
                        <td data-label="PART NUMBER">
                          <span v-html="highlightSearch(item.partnumber)"></span>
                        </td>

                        <td data-label="คงเหลือ">
                          {{ item.totalAmount }}
                        </td>
                      </tr>
                      <tr v-if="!searchedMaterials.length">
                        <td colspan="10" class="no-data-message">
                          ไม่พบข้อมูลที่ตรงกับคำค้นหา
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Materials Table -->
    <div class="bg-white p-6 rounded-lg shadow-lg mt-2">
      <!-- หมวดหมู่แบบ Checkbox พร้อมเปิด-ปิด -->
      <div class="relative mb-6" ref="categoryDropdownRef">
        <button
          @click="toggleCategoryDropdown"
          class="flex items-center justify-center w-full p-3 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white rounded-lg shadow-md focus:ring-2 focus:ring-gray-400 hover:bg-gray-800 transition duration-300"
        >
          <span>📂 เลือกหมวดหมู่</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-5 w-5 transition-transform duration-300"
            :class="{
              'rotate-180': isCategoryDropdownOpen,
              'rotate-0': !isCategoryDropdownOpen,
            }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <div
          v-if="isCategoryDropdownOpen"
          class="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-lg p-4 mt-2 w-full overflow-y-auto max-h-64 custom-scrollbar"
        >
          <div
            v-for="cat in categories"
            :key="cat"
            class="flex items-center gap-3 mb-2 p-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:via-blue-200 hover:to-blue-300 rounded-lg shadow-sm transition-transform duration-200 transform hover:translate-x-1"
          >
            <input
              type="checkbox"
              :id="cat"
              :value="cat"
              v-model="selectedCategory"
              class="checkbox-style cursor-pointer"
            />
            <label :for="cat" class="text-gray-800 font-medium cursor-pointer flex-grow">
              <span>{{ cat }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
          <label for="itemsPerPage" class="text-sm text-gray-600">แสดงรายการต่อหน้า:</label>
          <select id="itemsPerPage" v-model="itemsPerPage"
            class=" w-full text-right  p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @change="currentPage = 1">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="">ทั้งหมด</option>
          </select>
        </div>
      <!-- Table -->
      <div class="overflow-x-auto">
        <div class="table-container justify-center w-full overflow-x-auto">
          <div class="bg-white p-4 rounded-xl shadow-lg">
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr class="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                    <th class="w-[50px] text-center">ลำดับ</th>
                    <th class="w-[100px] text-center">รูปภาพ</th>
                    <th class="w-[200px] text-center">รายการ</th>
                    <th class="w-[150px] text-center">PART NUMBER</th>
                    <th class="w-[100px] text-center">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(material, index) in paginatedMaterials"
                    :key="material.id"
                    class="hover:bg-gray-100 transition-colors"
                  >
                    <td data-label="ลำดับ">
                      {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                    </td>
                    <td data-label="รูปภาพ">
                      <img
                        v-if="material.imageUrl"
                        :src="material.imageUrl"
                        alt="Material Image"
                        class="h-16 w-16 object-cover rounded-full mx-auto"
                        @click="openImageModal(material.imageUrl)"
                      />
                      <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                    </td>
                    <td data-label="รายการ">{{ material.name }}</td>
                    <td data-label="PART NUMBER">{{ material.partnumber }}</td>
                    <td data-label="คงเหลือ">{{ material.totalAmount }}</td>
                  </tr>
                  <!-- แสดงข้อความเมื่อไม่พบข้อมูล -->
                  <tr v-if="paginatedMaterials.length === 0">
                    <td colspan="5" class="text-center text-gray-500">
                      ❌ ไม่พบข้อมูลที่ตรงกับคำค้นหา
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <div
        class="pagination-container flex justify-center items-center mt-6 space-x-3 bg-gray-100 p-4 rounded-lg shadow-lg border border-gray-300"
      >
        <!-- ปุ่มไปหน้าแรก -->
        <button
          class="pagination-button-first-last text-blue-500 border-blue-500"
          :disabled="currentPage === 1"
          @click="currentPage = 1"
          v-if="currentPage > 3"
        >
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
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        </button>

        <!-- ปุ่มเลือกหน้า -->
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-button"
          :class="{ 'pagination-active': currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <!-- ปุ่มไปหน้าสุดท้าย -->
        <button
          v-if="currentPage < totalPageCount"
          class="pagination-button-first-last text-blue-500 border-blue-500"
          @click="currentPage = totalPageCount"
        >
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
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- Image Modal -->
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      @click.self="closeImageModal"
    >
      <div
        class="relative bg-gradient-to-b from-blue-100 via-white to-blue-100 p-6 rounded-lg shadow-2xl max-w-4xl border-4 border-yellow-500"
      >
        <!-- ปุ่มปิด (ย้ายตำแหน่งออกนอกขอบรูปภาพ) -->
        <button
          class="absolute top-[-20px] right-[-20px] bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110"
          @click="closeImageModal"
        >
          ✕
        </button>

        <!-- รูปภาพ -->
        <img
          :src="modalImageUrl"
          alt="Full Size Image"
          class="max-w-full max-h-[70vh] rounded-md border border-gray-300 shadow-md"
        />
      </div>
    </div>
  </userLayouts>
</template>

<style scoped>
/* Default Table Style */
.table th,
.table td {
  border-right: 1px solid #ddd; /* เส้นแนวตั้ง */
  border-left: 1px solid #ddd; /* เส้นแนวตั้ง */
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Kanit", sans-serif;
  font-size: 16px;
  table-layout: auto; /* ทำให้ขนาดคอลัมน์ปรับตามเนื้อหา */
}

/* Styling for Table Header */
.table thead {
  background: linear-gradient(to right, #4e73df, #1cc88a); /* สีไล่ระดับ */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เงาใต้หัวตาราง */
}

.table th {
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  vertical-align: middle; /* จัดให้อยู่กึ่งกลางในแนวตั้ง */
  padding: 12px; /* เพิ่ม Padding */
  font-weight: bold; /* ตัวหนา */
  color: #000000; /* สีข้อความ */
  text-transform: uppercase; /* เปลี่ยนข้อความให้เป็นตัวพิมพ์ใหญ่ */
  letter-spacing: 1px; /* ระยะห่างระหว่างตัวอักษร */
  transition: background-color 0.3s ease; /* เพิ่มเอฟเฟกต์เวลาโฟกัส */
}

.table td {
  padding: 10px;
  vertical-align: middle; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  text-align: center; /* ค่าเริ่มต้นจัดข้อความให้อยู่ตรงกลาง */
  border-bottom: 1px solid #ddd;
}

/* จัดคอลัมน์ "รายการ" ให้ชิดซ้าย */
.table td[data-label="รายการ"] {
  text-align: left;
  color: #333;
  font-weight: 500;
}

/* จัดตำแหน่งรูปภาพให้อยู่ตรงกลาง */
.table td[data-label="รูปภาพ"] img {
  display: block;
  margin: 0 auto;
  max-width: 50px;
  max-height: 50px;
  border-radius: 8px;
  object-fit: cover;
}
/* Responsive Table for screens smaller than 768px */
@media (max-width: 768px) {
  .table,
  .table thead,
  .table tbody,
  .table th,
  .table td,
  .table tr {
    display: block;
    width: 100%;
  }

  .table thead {
    display: none;
    /* ซ่อนหัวตาราง */
  }

  .table tr {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    background-color: #fefefe;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .table td {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #333;
    text-align: left;
  }

  .table td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #555;
    text-transform: capitalize;
    flex-basis: 40%;
  }

  .table td div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    /* ความกว้างสำหรับจอปกติ */
  }
}

/* จอขนาดเล็กกว่า 480px */
@media (max-width: 480px) {
  .table td {
    font-size: 12px;
    padding: 8px;
  }

  .table td::before {
    font-size: 12px;
    flex-basis: 50%;
  }

  .table td div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    /* ความกว้างสำหรับจอปกติ */
  }
}

/* กำหนดขนาด checkbox ให้คงที่ */
.checkbox-style {
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* เปลี่ยนสีเมื่อ checkbox ถูกเลือก */
.checkbox-style:checked {
  background-color: #4a90e2;
  border-color: #4a90e2;
}

/* เพิ่มไอคอนติ๊กเมื่อเลือก */
.checkbox-style:checked::after {
  content: "✔";
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  display: block;
}

/* Container สำหรับ checkbox */
.checkbox-container {
  flex-shrink: 0; /* ป้องกันการถูกบีบ */
  width: 24px; /* ความกว้างที่กำหนดแน่นอน */
  height: 24px; /* ความสูงที่กำหนดแน่นอน */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ข้อความที่ยาวจะถูกตัดและแสดง ... */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #b0b0b0 #f0f0f0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #b0b0b0;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #909090;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}
/* รายการแจ้งเตือน */
ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

ul li:hover {
  background-color: #e6f7ff; /* สีฟ้าอ่อน */
}

ul li span.text-red-500 {
  color: #ff4d4f; /* สีแดงสดสำหรับแจ้งเตือนสำคัญ */
}

ul li span.text-blue-500 {
  color: #0073e6; /* สีฟ้าสำหรับแจ้งเตือนทั่วไป */
}

/* ข้อความเมื่อไม่มีแจ้งเตือน */
.text-gray-500 {
  text-align: left;
  color: #808080;
  font-size: 14px;
  margin-top: 16px;
}

/* Scrollbar Styling */
div[v-if="isNotificationOpen"] {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #4a90e2 #f0f0f0; /* สี Thumb และ Track */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar {
  width: 10px; /* ความกว้างของ Scrollbar */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #0073e6); /* สีไล่ระดับของ Thumb */
  border-radius: 8px; /* ทำมุม Scrollbar ให้โค้งมน */
  border: 2px solid #f0f0f0; /* เพิ่มขอบสีรอบ Thumb */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0073e6, #0056b3); /* เปลี่ยนสีเมื่อ Hover */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-track {
  background: #f9f9f9; /* สีของ Track */
  border-radius: 8px; /* ทำมุม Track ให้โค้งมน */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาใน Track */
}
/* พื้นหลังของโมดอล */
div[v-if="isImageModalOpen"] {
  animation: fadeIn 0.3s ease-in-out;
}

/* ปุ่มปิด */
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* โลโก้ */
img {
  display: block;
  margin: 0 auto;
}

/* เอฟเฟกต์แสดงโมดอล */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ขอบและเงารูปภาพ */
img[src]:not([alt]) {
  border-radius: 8px;
  border: 2px solid #0073e6; /* สีฟ้าของ กฟผ. */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
.table-container {
  width: 100%;
  max-height: calc(70vh - 100px); /* ลดขนาดลงจากความสูงหน้าจอ */
  min-height: 300px; /* กำหนดความสูงขั้นต่ำ */
  height: auto; /* ปรับความสูงอัตโนมัติตามเนื้อหา */
  overflow-y: auto; /* เพิ่ม scroll หากเนื้อหายาวเกิน */
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .table-container {
    max-height: calc(100vh - 150px); /* ลดขนาดลงสำหรับจอเล็ก */
  }
}

@media (max-width: 480px) {
  .table-container {
    max-height: calc(100vh - 100px); /* ลดขนาดลงอีกสำหรับมือถือ */
  }
}
/* สไตล์ของคอนเทนเนอร์ Pagination */
.pagination-container {
  background-color: #e6f0ff; /* สีพื้นหลังคอนเทนเนอร์ (น้ำเงินอ่อน) */
  font-family: "Prompt", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #99c2ff; /* สีขอบ (น้ำเงิน) */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* ปุ่ม Pagination */
.pagination-button,
.pagination-button-first-last {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #0047ba; /* สีขอบปุ่ม */
  background-color: #ffffff; /* สีพื้นหลังปุ่ม */
  color: #0047ba; /* สีข้อความ (น้ำเงินเข้ม) */
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  min-width: 30px;
}

/* เอฟเฟกต์ Hover */
.pagination-button:hover,
.pagination-button-first-last:hover {
  background-color: #e0f0ff; /* สีพื้นหลังเมื่อ Hover */
  color: #002f73; /* สีข้อความเมื่อ Hover (น้ำเงินเข้มขึ้น) */
}

/* ปุ่ม First/Last */
.pagination-button-first-last {
  border: 1px solid #ffc107; /* สีขอบปุ่ม First/Last (เหลือง) */
  color: #ffc107; /* สีข้อความ (เหลือง) */
}

.pagination-button-first-last:hover {
  background-color: #fff4cc; /* สีพื้นหลังเมื่อ Hover (เหลืองอ่อน) */
  border-color: #ff9900; /* สีขอบเมื่อ Hover (เหลืองเข้ม) */
  color: #ff9900; /* สีข้อความเมื่อ Hover (เหลืองเข้ม) */
}

/* ปุ่ม Active */
.pagination-active {
  background-color: #0047ba; /* สีพื้นหลังปุ่มที่ Active (น้ำเงินเข้ม) */
  color: white; /* สีข้อความ */
  font-weight: 700;
  border: 1px solid #0047ba;
}

/* ปุ่ม Disabled */
.pagination-button:disabled,
.pagination-button-first-last:disabled {
  background-color: #dce6f7; /* สีพื้นหลังปุ่มที่ Disabled (น้ำเงินอ่อน) */
  color: #a0aec0; /* สีข้อความ */
  cursor: not-allowed;
  border-color: #99c2ff; /* สีขอบ */
}

/* Responsive Design */
@media (max-width: 1024px) {
  /* แท็บเล็ต */
  .pagination-container {
    gap: 6px;
    padding: 10px;
  }

  .pagination-button,
  .pagination-button-first-last {
    padding: 6px 12px;
    font-size: 14px;
  }

  .pagination-active {
    font-size: 14px;
    padding: 6px 12px;
  }
}

@media (max-width: 768px) {
  /* โทรศัพท์มือถือ */
  .pagination-container {
    gap: 4px;
    padding: 8px;
  }

  .pagination-button,
  .pagination-button-first-last {
    padding: 5px 10px;
    font-size: 12px;
  }

  .pagination-active {
    font-size: 12px;
    padding: 5px 10px;
  }
}

@media (max-width: 480px) {
  /* หน้าจอขนาดเล็กมาก */
  .pagination-container {
    flex-wrap: wrap; /* ให้ปุ่มขึ้นบรรทัดใหม่ */
    gap: 4px;
    padding: 6px;
  }

  .pagination-button,
  .pagination-button-first-last {
    padding: 4px 8px;
    font-size: 10px;
  }

  .pagination-active {
    font-size: 10px;
    padding: 4px 8px;
  }
}
/* Search Bar Container */
.search-bar-container {
  width: 100%; /* ใช้ความกว้างเต็มพื้นที่ */
  max-width: auto; /* กำหนดความกว้างสูงสุด */
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff; /* สีพื้นหลัง */
  border: 2px solid #ffc107; /* สีเหลือง EGAT */
  border-radius: 9999px; /* มุมโค้งกลม */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
  padding: 0.5rem 1rem; /* ระยะห่างด้านใน */
  transition: all 0.3s ease; /* เพิ่มเอฟเฟกต์ */
}

/* Search Icon */
.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0.5rem;
}

.search-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  fill: #ffc107; /* สีเหลือง EGAT */
}

/* Search Input */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #374151; /* สีข้อความ */
  padding: 0.5rem 1rem; /* ระยะห่างภายใน */
  background-color: transparent; /* โปร่งใส */
}

.search-input::placeholder {
  color: #9ca3af; /* สีข้อความ Placeholder */
  font-style: italic; /* ตัวเอียง */
}

/* Search Button */
.search-button {
  background-color: #ffc107; /* สีเหลือง EGAT */
  color: #374151; /* สีเทาเข้ม */
  font-weight: 600; /* ตัวหนา */
  border: none;
  border-radius: 9999px; /* มุมโค้ง */
  padding: 0.5rem 1rem; /* ระยะห่างภายใน */
  transition: all 0.3s ease; /* เพิ่มเอฟเฟกต์ */
  cursor: pointer;
}

.search-button:hover {
  background-color: #f9a825; /* สีเหลืองเข้ม */
  color: #ffffff; /* สีตัวอักษร */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
}

/* Hover Effect */
.search-bar:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* เพิ่มเงาเมื่อ Hover */
}

.search-input:focus {
  box-shadow: 0 0 6px rgba(255, 193, 7, 0.5); /* เงาสีเหลือง */
}
/* Scrollbar Styling สำหรับตาราง */
.table-container {
  width: 100%;
  max-height: calc(65vh - 100px); /* ลดขนาดลงจากความสูงหน้าจอ */
  min-height: 150px; /* กำหนดความสูงขั้นต่ำ */
  height: auto; /* ปรับความสูงอัตโนมัติตามเนื้อหา */
  overflow-y: auto; /* เพิ่ม scroll หากเนื้อหายาวเกิน */
  border: 1px solid #ddd;
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #007bff #f1f1f1; /* สี Thumb และ Track */
}

.table-container::-webkit-scrollbar {
  width: 10px; /* ความกว้าง scrollbar */
  height: 10px; /* ความสูง scrollbar แนวนอน */
}

.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #007bff); /* สีไล่ระดับของ Thumb */
  border-radius: 8px; /* มุม Thumb โค้งมน */
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #007bff, #0056b3); /* สีเมื่อ Hover */
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* สีพื้นหลังของ Track */
  border-radius: 8px; /* มุม Track โค้งมน */
}

.table-container::-webkit-scrollbar-track:hover {
  background: #e6e6e6; /* สี Track เมื่อ Hover */
}
.close-btn:hover {
  background-color: #e63946;
  transform: scale(1.1);
}

select {
  appearance: none;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>

