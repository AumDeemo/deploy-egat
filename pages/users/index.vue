<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/th";

const isNotificationOpen = ref(false);
const notificationDropdownRef = ref(null);
const latestUpdates = ref([]);
const totalMaterials = ref(0);
const lowStockCount = ref(0);
const intervalId = ref(null);
const isLoading = ref(true);

dayjs.locale("th");

const handleClickOutsideNotification = (event) => {
  if (
    notificationDropdownRef.value &&
    notificationDropdownRef.value.contains(event.target)
  ) {
    return;
  }
  isNotificationOpen.value = false;
};

onMounted(() => {
  window.addEventListener("click", handleClickOutsideNotification);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideNotification);
});

const fetchSummaryData = async () => {
  try {
    isLoading.value = true;
    const materialsResponse = await fetch("/api/admin/material");
    const materials = await materialsResponse.json();

    totalMaterials.value = materials.length;
    lowStockCount.value = materials.filter((item) => item.totalAmount < 10).length;

    const newUpdates = materials
      .map((item) => {
        const latestImport =
          item.importHistory?.length > 0
            ? item.importHistory.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
            : null;
        const latestExport =
          item.exportHistory?.length > 0
            ? item.exportHistory.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
            : null;

        let action = "";
        let timestamp = item.updatedAt;
        let actionType = "";

        if (
          latestImport &&
          (!latestExport || new Date(latestImport.date) > new Date(latestExport.date))
        ) {
          action = `นำเข้า ${latestImport.quantity}`;
          timestamp = latestImport.date;
          actionType = "import";
        } else if (latestExport) {
          action = `นำออก ${latestExport.quantity}`;
          timestamp = latestExport.date;
          actionType = "export";
        } else {
          return null; // ถ้าไม่มีข้อมูลนำเข้าและนำออก ไม่ต้องแสดงรายการนี้
        }

        return {
          message: `รายการ '${item.name}' ${action}`,
          totalAmount: item.totalAmount,
          timestamp: dayjs(timestamp).format("DD MMMM YYYY HH:mm น."),
          updatedAt: timestamp,
          actionType: actionType,
        };
      })
      .filter((update) => update !== null) // กรองค่าที่เป็น null ออก
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    latestUpdates.value = newUpdates.slice(0, 5);
  } catch (err) {
    console.error("Error fetching summary data:", err);
  } finally {
    isLoading.value = false;
  }
};

const startAutoUpdate = () => {
  intervalId.value = setInterval(fetchSummaryData, 10000);
};

onMounted(() => {
  fetchSummaryData();
  startAutoUpdate();
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>
<template>
  <userLayouts>
    <div
      class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-10 md:py-12 text-center rounded-lg shadow-xl mb-10 border-2 border-yellow-400"
    >
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide uppercase">
        ระบบบริหารจัดการวัสดุ
      </h1>
    </div>
    <div class="bg-white p-8 rounded-lg shadow-lg border border-gray-300">
      <h2
        class="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3 justify-center"
      >
        ⚙️
        <span>อัปเดตล่าสุด</span>
        <span
          class="bg-yellow-400 text-gray-800 px-4 py-1 text-sm font-bold rounded-full"
        >
          NEW
        </span>
      </h2>
      <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto scrollbar-custom">
        <li
          v-for="(update, index) in latestUpdates"
          :key="index"
          class="py-6 px-5 flex items-start gap-6 bg-gradient-to-r from-yellow-50 via-white to-gray-50 shadow-md rounded-lg hover:shadow-xl transition duration-300 border border-yellow-300"
        >
          <div class="flex-shrink-0">
            <div
              :class="{
                'h-14 w-14 bg-green-100 rounded-full flex items-center justify-center shadow-lg icon-effect mt-4':
                  update.actionType === 'import',
                'h-14 w-14 bg-red-100 rounded-full flex items-center justify-center shadow-lg icon-effect mt-4':
                  update.actionType === 'export',
              }"
            >
              <svg
                v-if="update.actionType === 'import'"
                class="w-6 h-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <svg
                v-else-if="update.actionType === 'export'"
                class="w-6 h-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
          <!-- ข้อมูลอัปเดต -->
          <div>
            <p class="font-semibold text-lg text-gray-800">
              {{ update.message.split(" ")[0] }}'
              <span
                :class="{
                  'text-green-700 font-bold': update.actionType === 'import',
                  'text-red-700 font-bold': update.actionType === 'export',
                }"
              >
                {{ update.message.split(" ").slice(1).join(" ") }}
              </span>
            </p>
            <p class="text-gray-700 text-base mt-1">
              คงเหลือ:
              <span
                :class="{
                  'text-red-700 font-bold': update.totalAmount <= 5,
                  'text-yellow-700 font-medium':
                    update.totalAmount > 5 && update.totalAmount <= 10,
                  'text-green-700 font-semibold': update.totalAmount > 10,
                }"
                >{{ update.totalAmount }}</span
              >
            </p>
            <p class="text-sm mt-1 text-blue-800 font-semibold">
              {{ update.timestamp }}
            </p>
          </div>
        </li>
      </ul>
      <p v-if="latestUpdates.length === 0" class="text-center text-gray-600 mt-6">
        ไม่มีข้อมูลอัปเดตล่าสุด
      </p>
    </div>
  </userLayouts>
</template>

<style scoped>
/* Custom Scrollbar Styling */
.scrollbar-custom {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #4a90e2 #f0f0f0; /* สี Thumb และ Track */
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px; /* ความกว้างของ Scrollbar */
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #0073e6); /* สีไล่ระดับของ Thumb */
  border-radius: 4px; /* ทำมุม Scrollbar ให้โค้งมน */
  border: 2px solid #f0f0f0; /* ขอบสีรอบ Thumb */
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0073e6, #0056b3); /* เปลี่ยนสีเมื่อ Hover */
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #f9f9f9; /* สีของ Track */
  border-radius: 4px; /* ทำมุม Track ให้โค้งมน */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาใน Track */
}

/* เอฟเฟกต์กระพริบและลดขยาย */
.icon-effect {
  animation: pulse 1.5s infinite; /* ลดขยายแบบวนลูป */
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1); /* ขนาดปกติ */
  }
  50% {
    transform: scale(1.05); /* ขยาย 20% */
  }
}
/* เพิ่มสีและพื้นหลังให้ timestamp */
.timestamp {
  color: #0044ff; /* สีฟ้าเข้ม */
  font-weight: 600; /* น้ำหนักตัวหนา */
  background-color: #e0f2fe; /* พื้นหลังฟ้าอ่อน */
  padding: 2px 6px; /* เพิ่มระยะห่างภายใน */
  border-radius: 4px; /* ทำให้มุมโค้งมน */
  display: inline-block; /* ให้ข้อความมีพื้นหลังติดกัน */
}
</style>