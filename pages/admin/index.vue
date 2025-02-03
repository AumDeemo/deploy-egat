<script setup>
import adminLayouts from "~/layouts/adminLayouts.vue";
import { ref, onMounted, onUnmounted } from "vue";

const totalMaterials = ref(0); // จำนวนอะไหล่ทั้งหมด
const lowStockCount = ref(0); // จำนวนอะไหล่ที่มีสต็อกต่ำ
const popularCategories = ref([]); // หมวดหมู่ยอดนิยม
const totalCURU = ref(0); // จำนวนคุรุภัณฑ์ทั้งหมด
const totalUsing = ref(0); // จำนวนเครื่องมือเครื่องใช้ทั้งหมด
const totalUsingBelow10000 = ref(0); // จำนวนเครื่องมือเครื่องใช้ราคาต่ำกว่า 10000
const intervalId = ref(null);
const isLoading = ref(true); // สถานะการโหลดข้อมูล
const latestUpdates = ref([]); // รายการอัปเดตล่าสุด

const fetchSummaryData = async () => {
  try {
    isLoading.value = true; // เริ่มการโหลด
    const materialsResponse = await fetch("/api/admin/material");
    const materials = await materialsResponse.json();

    // คำนวณจำนวนอะไหล่ทั้งหมด
    totalMaterials.value = materials.length;

    // คำนวณจำนวนอะไหล่ที่คงเหลือน้อยกว่า 10
    lowStockCount.value = materials.filter((item) => item.totalAmount < 10).length;

    // คำนวณหมวดหมู่ยอดนิยม
    const categoryCount = {};
    materials.forEach((item) => {
      const categories = item.category?.split(",") || [];
      categories.forEach((category) => {
        category = category.trim();
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });
    popularCategories.value = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // ดึงข้อมูลคุรุภัณฑ์
    const curuResponse = await fetch("/api/admin/crument/curu/curu");
    totalCURU.value = (await curuResponse.json()).length;

    // ดึงข้อมูลเครื่องมือเครื่องใช้
    const usingResponse = await fetch("/api/admin/crument/using/using");
    totalUsing.value = (await usingResponse.json()).length;

    // ดึงข้อมูลเครื่องมือเครื่องใช้ราคาต่ำกว่า 10000
    const usingBelow10000Response = await fetch("/api/admin/crument/using10000/10000");
    totalUsingBelow10000.value = (await usingBelow10000Response.json()).length;

    // สร้างรายการอัปเดตใหม่
    const newUpdates = materials
      .map((item) => ({
        message: `รายการ '${item.name}'`,
        totalAmount: item.totalAmount,
        timestamp: new Date(item.updatedAt).toLocaleString(),
        updatedAt: item.updatedAt, // ใช้สำหรับจัดเรียง
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // เรียงลำดับโดยเวลาล่าสุด

    // จำกัดรายการอัปเดตล่าสุดให้เหลือเพียง 5 รายการ
    latestUpdates.value = newUpdates.slice(0, 5);
  } catch (err) {
    console.error("Error fetching summary data:", err);
  } finally {
    isLoading.value = false; // สิ้นสุดการโหลด
  }
};

// อัปเดตข้อมูลแบบอัตโนมัติ
const startAutoUpdate = () => {
  intervalId.value = setInterval(fetchSummaryData, 10000); // อัปเดตทุก 10 วินาที
};

// หยุดการอัปเดตอัตโนมัติเมื่อออกจากคอมโพเนนต์
onMounted(() => {
  fetchSummaryData();
  startAutoUpdate();
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});

definePageMeta({
  middleware: 'check-role'
})
</script>

<template>
  <adminLayouts>
    <div
      class="p-4 md:p-8 bg-gradient-to-b from-blue-50 via-white to-yellow-50 min-h-screen"
    >
      <!-- Header -->
      <div
        class="text-center mb-8 bg-gradient-to-r from-blue-900 to-blue-600 text-white py-10 rounded-xl shadow-lg"
      >
        <div class="flex items-center justify-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-12 h-12"
          >
            <path
              d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z"
            />
          </svg>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-wider">Dashboard</h1>
        </div>
        <p class="text-lg mt-2">ภาพรวมระบบ</p>
      </div>

      <!-- Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Card: Total Materials -->
        <div
          class="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition duration-300"
        >
          <div
            class="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-md shadow-lg"
          >
            <h2 class="text-lg font-medium text-white text-center">
              ⚙️ จำนวนอะไหล่ทั้งหมด
            </h2>
          </div>
          <p class="text-9xl font-semibold text-blue-600 mt-4 text-center">
            {{ totalMaterials }}
          </p>
          <p class="text-sm text-gray-500 text-center mt-2">จำนวนรายการที่มีอยู่ในระบบ</p>
        </div>

        <!-- Card: Low Stock Materials -->
        <div
          class="bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm hover:shadow-md transition duration-300"
        >
          <div
            class="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-md shadow-lg"
          >
            <h2 class="text-lg font-medium text-white text-center">
              🚨 อะไหล่คงเหลือน้อย
            </h2>
          </div>
          <p class="text-9xl font-semibold text-red-600 mt-4 text-center">
            {{ lowStockCount }}
          </p>
          <p class="text-sm text-gray-500 text-center mt-2">รายการที่ต้องเติมสต็อก</p>
        </div>

        <!-- Card: Popular Categories -->
        <div
          class="bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-4 rounded-md shadow-lg"
          >
            <h2 class="text-lg font-medium text-white text-center">📊 หมวดหมู่</h2>
          </div>
          <ul class="mt-4 space-y-3 max-h-48 overflow-y-auto scrollbar-custom">
            <li
              v-for="(category, index) in popularCategories"
              :key="index"
              class="flex justify-between items-center bg-yellow-100 p-3 rounded-md"
            >
              <span class="text-sm font-medium text-yellow-800">{{ category[0] }}</span>
              <span
                class="bg-yellow-200 text-yellow-900 px-3 py-1 text-center rounded-full text-xs font-semibold whitespace-nowrap"
                >{{ category[1] }} รายการ</span
              >
            </li>
          </ul>
        </div>

        <!-- Card: Total CURU -->
        <div
          class="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition duration-300"
        >
          <div
            class="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-md shadow-lg"
          >
            <h2 class="text-lg font-medium text-white text-center">
              📦 คุรุภัณฑ์ทั้งหมด
            </h2>
          </div>
          <p class="text-9xl font-semibold text-green-600 mt-4 text-center">
            {{ totalCURU }}
          </p>
          <p class="text-sm text-gray-500 text-center mt-2">จำนวนรายการคุรุภัณฑ์ในระบบ</p>
        </div>

        <!-- Card: Total Using -->
        <div
          class="bg-purple-50 p-6 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition duration-300"
        >
          <div
            class="bg-gradient-to-r from-purple-400 to-purple-500 text-white p-4 rounded-md shadow-lg"
          >
            <h2 class="text-lg font-medium text-white text-center">
              📦 เครื่องมือเครื่องใช้ทั้งหมด
            </h2>
          </div>
          <p class="text-9xl font-semibold text-purple-600 mt-4 text-center">
            {{ totalUsing }}
          </p>
          <p class="text-sm text-gray-500 text-center mt-2">
            จำนวนรายการเครื่องมือเครื่องใช้ในระบบ
          </p>
        </div>

        <!-- Card: Total Using Below 10000 -->
        <div
          class="bg-orange-50 p-6 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition duration-300"
        >
          <!-- Container for the card header with gradient background and shadow -->
          <div
            class="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-md shadow-lg"
          >
            <!-- Title for the card: Indicates tools priced below 10,000 -->
            <h2 class="text-lg font-medium text-white text-center whitespace-normal">
              📦 เครื่องมือเครื่องใช้ < 10K
            </h2>
          </div>

          <p class="text-9xl font-semibold text-orange-600 mt-4 text-center">
            {{ totalUsingBelow10000 }}
          </p>
          <p class="text-sm text-gray-500 text-center mt-2">
            จำนวนรายการราคาต่ำกว่า 10,000
          </p>
        </div>
      </div>

      <!-- Latest Updates -->
      <div
        class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg shadow-lg border border-gray-300"
      >
        <h2
          class="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3 justify-center"
        >
          <span>🕒 อัปเดตล่าสุด</span>
          <span class="bg-blue-600 text-white px-3 py-1 text-sm rounded-full shadow"
            >NEW</span
          >
        </h2>
        <ul class="divide-y divide-gray-300">
          <li
            v-for="(update, index) in latestUpdates"
            :key="index"
            class="py-6 flex items-start gap-6 transition-transform transform hover:scale-105 hover:shadow-md"
          >
            <div class="flex-shrink-0 mt-4">
              <div
                class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg relative group"
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
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>

                <div
                  class="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-ping"
                ></div>
              </div>
            </div>
            <div>
              <p class="text-lg font-bold text-gray-700">{{ update.message }}</p>
              <p class="text-gray-500 text-base mt-1">
                คงเหลือ:
                <span
                  :class="{
                    'text-red-600 font-bold': update.totalAmount <= 5,
                    'text-yellow-600 font-medium':
                      update.totalAmount > 5 && update.totalAmount <= 10,
                    'text-green-600 font-semibold': update.totalAmount > 10,
                  }"
                >
                  {{ update.totalAmount }}
                </span>
              </p>
              <p class="text-gray-500 text-sm mt-1">{{ update.timestamp }}</p>
            </div>
          </li>
        </ul>
        <p v-if="latestUpdates.length === 0" class="text-center text-gray-500 mt-6">
          ไม่มีข้อมูลอัปเดตล่าสุด
        </p>
      </div>

      <!-- Footer -->
      <footer class="mt-8 md:mt-16 text-center text-gray-500 text-sm">
        © 2025 การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT). All rights reserved.
      </footer>
    </div>
  </adminLayouts>
</template>

<style scoped>
h1 {
  font-family: "Prompt", sans-serif;
}

footer {
  font-family: "Prompt", sans-serif;
}

/* Custom scrollbar styles */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #ffc107 #ffe69c;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background-color: #ffc107;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #ffe69c;
}

@media (max-width: 640px) {
  h2 {
    font-size: 0.875rem; /* ลดขนาด font */
  }

  p {
    font-size: 1rem; /* ลดขนาดข้อความ */
  }

  .p-4 {
    padding: 0.5rem; /* ลด padding */
  }
}
</style>
