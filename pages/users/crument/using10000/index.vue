<template>
  <usersLayouts>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- ส่วนหัว -->
      <header
        class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg px-8 py-4 shadow-lg"
      >
        <h1 class="text-4xl font-extrabold text-center tracking-wide">
          ระบบจัดการข้อมูลเครื่องมือเครื่องใช้ราคาต่ำกว่า 10,000 บาท
        </h1>
        <p class="text-center text-sm mt-2 font-light">
          การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)
        </p>
      </header>
      <div
        class=" bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between gap-6"
      >
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
                <path
                  d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z"
                />
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
      </div>
      <!-- ตาราง -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">
          รายการเครื่องมือเครื่องใช้ราคาต่ำกว่า 10,000 บาท
        </h2>
        <div class="overflow-x-auto">
          <!-- เพิ่ม container ที่มี scroll -->
          <div
            class="overflow-y-auto max-h-96 rounded-lg border border-gray-300 scrollbar-custom"
          >
            <table
              class="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm"
            >
              <thead class="bg-gray-100">
                <tr>
                  <th class="w-[10%]">ลำดับ</th>
                  <th class="w-[20%]">รูปภาพ</th>
                  <th class="w-[35%]">ชื่อรุ่น</th>
                  <th class="w-[35%]">รหัสเครื่องมือเครื่องใช้</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="using10000 in paginatedusing10000" key="using10000.id">
                  <th data-label="ลำดับ">{{ using10000.number }}</th>
                  <td data-label="รูปภาพ">
                    <!-- แสดงรูปภาพถ้ามี URL -->
                    <img
                      v-if="using10000.imageUrl"
                      :src="using10000.imageUrl"
                      alt="using10000 Image"
                      class="h-16 w-16 object-cover rounded-md"
                    />
                    <!-- แสดงข้อความถ้าไม่มีรูป -->
                    <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                  </td>
                  <td
                    data-label="ชื่อรุ่น"
                    @click="openModal(MODAL_TYPES.DETAILS, using10000)"
                  >
                    {{ using10000.name }}
                  </td>
                  <td data-label="รหัสเครื่องมือเครื่องใช้">
                    {{ using10000.partnumber }}
                  </td>
                </tr>
                <!-- แสดงข้อความ "ไม่มีรายการ" เมื่อ filtered ไม่มีข้อมูล -->
                <tr v-if="paginatedusing10000.length === 0">
                  <td colspan="7" class="p-4 text-center text-gray-500">ไม่มีรายการ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="pagination-container">
            <button
              class="pagination-button-first"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
              v-if="currentPage > 4"
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

            <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-button"
              :class="currentPage === page ? 'pagination-active' : ''"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              class="pagination-button-last"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
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
      </div>

      <!-- Modals -->
      <!-- Modal แสดงผลลัพธ์การค้นหา -->
      <div
        v-if="modalType === 'searchResults'"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeModal"
      >
        <button
          @click="closeModal"
          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
        >
          ✕
        </button>
        <div
          class="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto shadow-lg relative"
        >
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">
            ผลลัพธ์การค้นหา
          </h2>

          <div class="text-gray-600 text-center mb-4">
            พบ {{ filteredSearchResults.length }} รายการที่ตรงกับการค้นหา
          </div>

          <div class="mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="พิมพ์เพื่อค้นหา..."
              class="search-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="filterSearchResults"
            />
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="overflow-y-auto max-h-96">
              <table
                class="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm"
              >
                <thead class="bg-gray-100">
                  <tr>
                    <th class="w-[50px]">ลำดับ</th>
                    <th>รูปภาพ</th>
                    <th>ชื่อรุ่น</th>
                    <th>รหัสสินทรัพย์</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="result in filteredSearchResults" :key="result.id">
                    <td>{{ result.number }}</td>
                    <td>
                      <img
                        v-if="result.imageUrl"
                        :src="result.imageUrl"
                        alt="Result Image"
                        class="h-16 w-16 object-cover rounded-md"
                      />
                      <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                    </td>
                    <td
                      data-label="ชื่อรุ่น"
                      @click="openModal(MODAL_TYPES.DETAILS, result)"
                    >
                      <span v-html="highlightText(result.name, searchQuery)"></span>
                    </td>
                    <td data-label="รหัสสินทรัพย์">
                      <span v-html="highlightText(result.partnumber, searchQuery)"></span>
                    </td>
                  </tr>
                  <tr v-if="filteredSearchResults.length === 0">
                    <td colspan="7" class="p-4 text-center text-gray-500">
                      ไม่มีผลลัพธ์
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Details Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DETAILS"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-auto shadow-lg relative"
        >
          <!-- ปุ่มปิดมุมขวาบน -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
          >
            ✕
          </button>
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">
            รายละเอียดเครื่องมือเครื่องใช้ราคาต่ำกว่า 10,000 บาท
          </h2>

          <!-- Table for Details -->
          <div class="overflow-x-auto">
            <table
              class="details-modal w-full text-left border-collapse border border-gray-300"
            >
              <thead class="bg-blue-100 text-blue-600 font-semibold">
                <tr>
                  <th class="py-3 px-4 border-b border-gray-300">ลำดับที่</th>
                  <th class="py-3 px-4 border-b border-gray-300">รหัสพัสดุ</th>
                  <th class="py-3 px-4 border-b border-gray-300">
                    รหัสเครื่องมือเครื่องใช้
                  </th>
                  <th class="py-3 px-4 border-b border-gray-300">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.number }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.curunumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.partnumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.detial }}</td>
                </tr>
              </tbody>
            </table>
            <table
              class="details-modal w-full mt-1 text-left border-collapse border border-gray-300"
            >
              <thead class="bg-blue-100 text-blue-600 font-semibold">
                <tr>
                  <th class="py-3 px-4 border-b border-gray-300">ยี่ห้อ</th>
                  <th class="py-3 px-4 border-b border-gray-300">รุ่น</th>
                  <th class="py-3 px-4 border-b border-gray-300">หมายเลขเครื่อง</th>
                  <th class="py-3 px-4 border-b border-gray-300">วันที่ได้มา</th>
                  <th class="py-3 px-4 border-b border-gray-300">เลขที่ใบโอน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.brand }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.name }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing10000.usenumber }}</td>
                  <td class="py-2 px-4 border-b">
                    {{ formatDate(selectedusing10000.date) }}
                  </td>
                  <td class="py-2 px-4 border-b">
                    {{ selectedusing10000.detialnumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Image Preview -->
          <div class="preview-container">
            <!-- รูปภาพ -->
            <img
              v-if="selectedusing10000.imageUrl"
              :src="selectedusing10000.imageUrl"
              alt="Image Preview"
              class="image-preview cursor-pointer"
              @click="openImageModal(selectedusing10000.imageUrl)"
            />
            <p v-else class="text-gray-500 text-center font-semibold">ไม่มีรูปภาพ</p>
          </div>

          <!-- Fullscreen Image Modal -->
          <div
            v-if="isImageModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          >
            <button
              @click="closeImageModal"
              class="absolute top-4 right-4 text-white bg-red-500 px-3 py-2 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
            <img
              :src="imageModalUrl"
              alt="Expanded Image"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <!-- Close Button -->
          <div class="mt-6 flex justify-end">
            <button
              @click="closeModal"
              class="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  </usersLayouts>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import usersLayouts from "~/layouts/userLayouts.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedusing10000 = ref(null);
const using10000 = ref([]); // ใช้เก็บข้อมูล
const modalType = ref(null);
const sortKey = ref("number"); // ค่าเริ่มต้นคือจัดเรียงตาม "number"
const sortOrder = ref("asc"); // "asc" คือจากน้อยไปมาก, "desc" คือจากมากไปน้อย
const isImageModalOpen = ref(false); // State สำหรับ modal
const imageModalUrl = ref(""); // URL รูปภาพที่จะแสดงใน modal
const currentPage = ref(1); // หน้าปัจจุบัน
const itemsPerPage = 10; // จำนวนรายการต่อหน้า
const maxPageDisplay = 6; // จำนวนหน้าที่แสดงใน Pagination
const filteredSearchResults = ref([]); // ผลลัพธ์การค้นหา

const filterSearchResults = () => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    filteredSearchResults.value = [];
    return;
  }

  // ค้นหาข้อมูลใน using10000
  filteredSearchResults.value = using10000.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.curunumber?.toLowerCase().includes(query) ||
      item.partnumber?.toLowerCase().includes(query) ||
      (item.detial && item.detial.toLowerCase().includes(query))
  );
};

const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<mark class="highlight">$1</mark>`);
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    toast.info("กรุณาใส่คำค้นหา", {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    return;
  }

  const query = searchQuery.value.trim().toLowerCase();

  // ค้นหาใน using10000
  filteredSearchResults.value = using10000.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.curunumber?.toLowerCase().includes(query) ||
      item.partnumber?.toLowerCase().includes(query) ||
      (item.detial && item.detial.toLowerCase().includes(query))
  );

  modalType.value = "searchResults"; // เปิด modal ผลการค้นหา
};
// แบ่งข้อมูลตาม Pagination
const paginatedusing10000 = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredusing10000.value.slice(startIndex, endIndex);
});

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() =>
  Math.ceil(filteredusing10000.value.length / itemsPerPage)
);

// คำนวณหน้าที่จะแสดงใน Pagination (สูงสุด 6 หน้า)
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= maxPageDisplay) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(1, current - Math.floor(maxPageDisplay / 2));
  const end = Math.min(total, start + maxPageDisplay - 1);

  if (end - start + 1 < maxPageDisplay && start > 1) {
    return Array.from({ length: maxPageDisplay }, (_, i) => end - maxPageDisplay + i + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const openImageModal = (imageUrl) => {
  imageModalUrl.value = imageUrl;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
  imageModalUrl.value = "";
};

const MODAL_TYPES = {
  DETAILS: "details",
};

// ฟิลเตอร์ไฟล์ตามคำค้นหา
const filteredusing10000 = computed(() => {
  // คัดลอกข้อมูลทั้งหมดจาก `using10000` มาใช้เป็นข้อมูลเริ่มต้น
  let filtered = [...using10000.value];

  // จัดเรียงข้อมูล
  filtered.sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];

    if (sortOrder.value === "asc") {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });

  return filtered;
});

const fetchusing10000 = async () => {
  try {
    const response = await fetch("/api/admin/crument/using10000/10000", {
      method: "GET",
    });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    using10000.value = await response.json();
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const openModal = (type, using10000) => {
  modalType.value = type;
  selectedusing10000.value = using10000;
};

const closeModal = () => {
  modalType.value = null;
  selectedusing10000.value = null;
};

onMounted(async () => {
  await fetchusing10000();
});
</script>

<style scoped>
/* General Styles */
input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

button {
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}
/* ปุ่ม Edit */
.edit-btn {
  background-color: #f59e0b; /* สีเหลือง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex; /* ใช้ flexbox */
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.edit-btn:hover {
  background-color: #d97706; /* สีเหลืองเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-btn:active {
  transform: scale(0.97);
}
/* ปุ่มลบ */
.delete-btn {
  background-color: #e11d48; /* สีแดง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #be123c; /* สีแดงเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn:active {
  transform: scale(0.97);
}

/* จัดตำแหน่งรูปภาพให้อยู่ตรงกลาง */
td[data-label="รูปภาพ"] {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดให้อยู่ตรงกลางแนวนอน */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  height: 100%; /* ให้เต็มความสูงของช่อง */
}

/* ตาราง */
.table-auto {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
}

.table-auto th,
.table-auto td {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.table-auto th {
  background-color: #007bff; /* สีหัวตาราง */
  color: white;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
}

.table-auto td {
  background-color: #ffffff;
  font-size: 14px;
  color: #4b5563;
  vertical-align: middle;
  transition: background-color 0.3s;
}

.table-auto tr:nth-child(even) td {
  background-color: #f9fafb;
}

.table-auto tr:hover td {
  background-color: #e3f2fd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Scrollbar ของตาราง */
.overflow-y-auto::-webkit-scrollbar {
  width: 10px; /* ความกว้างของ Scrollbar */
  background-color: #f0f4f8; /* สีพื้นหลังของ Scrollbar */
  border-radius: 8px; /* มุมโค้ง */
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #003c71; /* สีของ Scrollbar */
  border-radius: 8px; /* มุมโค้ง */
  border: 2px solid #eaf4ff; /* ระยะห่างของ Scrollbar */
  transition: background-color 0.3s, border-color 0.3s; /* เพิ่มเอฟเฟกต์ */
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #00254d; /* สีเข้มขึ้นเมื่อ Hover */
  border-color: #dbeafe; /* เปลี่ยนสีขอบเมื่อ Hover */
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #ffffff; /* สีพื้นหลังของ Track */
  border-radius: 8px; /* มุมโค้ง */
  margin: 4px; /* ระยะห่างระหว่าง Track */
}

/* Scrollbar เมื่ออยู่ใน Modal หรือ Fixed Container */
.fixed::-webkit-scrollbar {
  width: 10px;
}

.fixed::-webkit-scrollbar-thumb {
  background-color: #003c71;
  border-radius: 8px;
}

.fixed::-webkit-scrollbar-track {
  background-color: #f0f4f8;
  border-radius: 8px;
}

/* สำหรับขนาดหน้าจอเล็ก */
@media (max-width: 768px) {
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px; /* ลดความกว้างสำหรับหน้าจอเล็ก */
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #003c71;
  }
}

/* ปุ่ม Preview */
.preview-btn {
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex; /* ใช้ flexbox */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  gap: 8px; /* ระยะห่างระหว่างไอคอนกับข้อความ */
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.preview-btn:hover {
  background-color: #4338ca;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-btn:active {
  transform: scale(0.97);
}

.preview-btn svg {
  width: 16px; /* ขนาดไอคอน */
  height: 16px;
}

.preview-btn span {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  input {
    font-size: 14px;
    padding: 10px;
  }

  .download-btn,
  .delete-btn,
  .preview-btn {
    font-size: 12px;
    padding: 10px 16px;
  }

  .table-auto th,
  .table-auto td {
    font-size: 12px;
    padding: 10px;
  }
}
th,
td {
  border-right: 1px solid #d1d5db; /* เส้นแนวตั้งสีเทาอ่อน */
}

th:last-child,
td:last-child {
  border-right: none; /* ไม่แสดงเส้นแนวตั้งในคอลัมน์สุดท้าย */
}
/* สำหรับหัวตารางใน Details Modal */
.details-modal th {
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  padding: 12px 16px;
  background-color: #4f46e5; /* สีพื้นหลังของหัวตาราง */
  color: white; /* สีข้อความ */
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  border-bottom: 2px solid #e5e7eb; /* เพิ่มเส้นแบ่งด้านล่าง */
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
}
.details-modal td {
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  padding: 10px 12px;
  font-size: 14px;
  color: #4b5563; /* สีข้อความในตาราง */
  border-bottom: 1px solid #e5e7eb; /* เพิ่มเส้นแบ่งด้านล่าง */
}
.details-modal tr:nth-child(even) td {
  background-color: #f9fafb; /* สีพื้นหลังของแถวคู่ */
}
.details-modal tr:hover td {
  background-color: #e3f2fd; /* สีพื้นหลังเมื่อ hover */
}
.preview-container {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดให้อยู่กึ่งกลางแนวนอน */
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  width: 100%; /* ความกว้างเต็มที่ของ container */
  max-width: 500px; /* จำกัดความกว้างสูงสุด */
  max-height: 400px; /* จำกัดความสูงสูงสุด */
  background-color: #ffffff; /* สีพื้นหลัง */
  border: 2px solid #007bff; /* ขอบสีน้ำเงิน */
  border-radius: 16px; /* มุมโค้ง */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* เพิ่มเงา */
  padding: 16px; /* เพิ่มระยะห่างภายใน */
  margin: 20px auto; /* ระยะห่างจากส่วนอื่นๆ */
  overflow: hidden; /* ซ่อนส่วนที่เกิน */
  position: relative; /* ใช้สำหรับการวางตำแหน่ง */
  text-align: center; /* จัดข้อความให้อยู่กึ่งกลางแนวนอน */
  transition: transform 0.3s, box-shadow 0.3s; /* เพิ่มเอฟเฟกต์เมื่อ Hover */
}

.preview-container:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
}

/* Image Preview */
.image-preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.image-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Fullscreen Image Modal */
.fixed {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 50;
}

img.max-w-full {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.preview-container p {
  font-size: 16px; /* ขนาดตัวอักษร */
  color: #6b7280; /* สีข้อความ */
  font-weight: bold; /* ตัวหนา */
}
/* Container ของ Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px 16px;
  background-color: #ffffff; /* พื้นหลังสีขาว */
  border-radius: 6px;
  border: 1px solid #003c71; /* ขอบสีน้ำเงินเข้ม */
  box-shadow: 0 2px 6px rgba(0, 60, 113, 0.1); /* เพิ่มเงาสีน้ำเงิน */
  font-family: "Prompt", sans-serif;
}

/* ปุ่ม Pagination ทั่วไป */
.pagination-button,
.pagination-button-first,
.pagination-button-last {
  padding: 10px 20px;
  border-radius: 6px;
  background-color: #f0f7fc; /* สีฟ้าอ่อน */
  color: #003c71; /* สีน้ำเงินเข้ม */
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #cfe3f4; /* ขอบสีฟ้าอ่อน */
  transition: all 0.2s ease;
  text-align: center;
  min-width: 40px;
}

/* Hover Effect */
.pagination-button:hover,
.pagination-button-first:hover,
.pagination-button-last:hover {
  background-color: #003c71; /* สีน้ำเงินเข้ม */
  color: #ffffff; /* สีขาว */
  border-color: #003c71;
  box-shadow: 0 4px 8px rgba(0, 60, 113, 0.3); /* เพิ่มเงาเมื่อ Hover */
}

/* ปุ่มที่ถูกเลือก */
.pagination-active {
  background-color: #003c71; /* สีน้ำเงินเข้ม */
  color: #ffffff; /* สีขาว */
  font-weight: bold;
  border: 1px solid #003c71;
  box-shadow: 0 4px 8px rgba(0, 60, 113, 0.4); /* เงาเข้มขึ้น */
}

/* ปุ่ม Disabled */
button:disabled {
  background-color: #e9ecef; /* สีเทาอ่อน */
  color: #6c757d; /* สีเทา */
  cursor: not-allowed;
  border-color: #dee2e6; /* ขอบสีเทา */
}

/* ไอคอนในปุ่ม */
.icon-size {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* เอฟเฟกต์ไอคอน */
.pagination-button svg,
.pagination-button-first svg,
.pagination-button-last svg {
  transition: transform 0.2s ease;
}

.pagination-button:hover svg,
.pagination-button-first:hover svg,
.pagination-button-last:hover svg {
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ Hover */
}

/* Responsive Design */
@media (max-width: 768px) {
  .pagination-container {
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px;
  }

  .pagination-button,
  .pagination-button-first,
  .pagination-button-last {
    padding: 8px 12px;
    font-size: 12px;
  }

  .icon-size {
    width: 16px;
    height: 16px;
  }
  .search-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem;
    border-radius: 12px;
  }

  .search-icon {
    display: none; /* ซ่อนไอคอนในมือถือ */
  }

  .search-input {
    font-size: 14px;
    padding: 10px;
    width: 100%;
    text-align: center; /* จัดให้ข้อความอยู่ตรงกลาง */
  }

  .search-button {
    width: 100%;
    margin-top: 8px;
    font-size: 14px;
    padding: 10px;
  }
  .flex-container {
    flex-direction: column;
    align-items: stretch; /* ทำให้เต็มความกว้าง */
    gap: 0.75rem;
  }
  
}
/* Responsive สำหรับมือถือขนาดเล็ก */
@media (max-width: 480px) {
  .search-bar {
    padding: 0.2rem 0.4rem;
  }

  .search-input {
    font-size: 0.85rem;
    padding: 0.2rem;
  }

  .search-button {
    font-size: 0.85rem;
    padding: 0.2rem 0.4rem;
  }
  .search-icon {
    display: none; /* ซ่อนไอคอนในมือถือ */
  }

  .search-bar-container {
    width: 100%;
  }
}
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
  border-radius: 20px; /* มุมโค้งกลม */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
  padding: 0.5rem 1rem; /* ระยะห่างด้านใน */
  transition: all 0.3s ease; /* เพิ่มเอฟเฟกต์ */
}

/* Search Icon */
.search-icon {
  padding: 0.75rem 1rem; /* เพิ่มระยะห่าง */
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
</style>
