<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted, computed } from "vue";

const materials = ref([]);
const searchQuery = ref(""); // เก็บค่าคำค้นหา
const selectedCategories = ref([]); // เก็บค่าหมวดหมู่ที่เลือก
const categories = ref([]); // รายการหมวดหมู่ทั้งหมด
const isCategoryDropdownOpen = ref(false); // เปิด-ปิด dropdown หมวดหมู่
const categoryDropdownRef = ref(null); // สำหรับอ้างอิง dropdown หมวดหมู่

// ฟังก์ชันเปิด-ปิด dropdown หมวดหมู่
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
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
});

// ลบ Event Listener เมื่อคอมโพเนนต์ถูก unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideCategory);
});
// ฟังก์ชันดึงข้อมูลวัสดุจาก API
const fetchMaterials = async () => {
  try {
    const response = await fetch("/api/admin/material", {
      method: "GET",
    });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    materials.value = await response.json();
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

  // กรองตามหมวดหมู่ที่เลือก
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || []; // แปลงเป็นอาร์เรย์ถ้ามันเป็นสตริงที่คั่นด้วยคอมม่า

      return selectedCategories.value.some((selected) =>
        materialCategories.includes(selected)
      );
    });
  }

  // กรองตามคำค้นหาหลายคำที่พิมพ์ (ค้นหาจากชื่อวัสดุและหมวดหมู่)
  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" "); // แยกคำค้นหา

    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || []; // แปลงเป็นอาร์เรย์ถ้ามันเป็นสตริงที่คั่นด้วยคอมม่า

      return searchTerms.every((term) => {
        return (
          material.name?.toLowerCase().includes(term) || // ค้นหาจากชื่อวัสดุ
          materialCategories.some((cat) => cat.toLowerCase().includes(term)) || // ค้นหาจากหมวดหมู่
          material.partnumber?.toLowerCase().includes(term) // ค้นหาจาก Part Number
        );
      });
    });
  }

  return filtered;
});

// ดึงข้อมูลวัสดุเมื่อ component ถูก mounted
onMounted(() => {
  fetchMaterials();
  fetchCategories();
});
</script>

<template>
  <userLayouts>
    <!-- ช่องค้นหา -->
    <div class="flex justify-center mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 ค้นหา"
        class="w-full p-3 border border-gray-300 rounded-full shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400"
      />
    </div>
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
          v-for="category in categories"
          :key="category"
          class="flex items-center gap-3 mb-2 p-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:via-blue-200 hover:to-blue-300 rounded-lg shadow-sm transition-transform duration-200 transform hover:translate-x-1"
        >
          <input
            type="checkbox"
            :id="'category-' + category"
            :value="category"
            v-model="selectedCategories"
            class="checkbox-style cursor-pointer"
          />
          <label
            :for="'category-' + category"
            class="text-gray-800 font-medium cursor-pointer flex-grow"
          >
            {{ category }}
          </label>
        </div>
      </div>
    </div>

    <!-- Materials Table -->
    <div class="mt-5 justify-center w-full h-[680px] overflow-x-auto">
      <div class="bg-white p-4 rounded-xl shadow-lg">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <th class="min-w-[50px]">ลำดับ</th>
                <th class="min-w-[100px]">รูปภาพ</th>
                <th class="min-w-[150px]">รายการ</th>
                <th class="min-w-[150px]">PART NUMBER</th>
                <th class="min-w-[150px]">คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(material, index) in filteredMaterials"
                :key="material.id"
                class="hover:bg-gray-100 transition-colors"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <img
                    v-if="material.imageUrl"
                    :src="material.imageUrl"
                    alt="Material Image"
                    class="h-16 w-16 object-cover rounded-full mx-auto"
                  />
                  <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                </td>
                <td>{{ material.name }}</td>
                <td>{{ material.partnumber }}</td>
                <td>{{ material.totalAmount }}</td>
              </tr>
              <!-- แสดงข้อความเมื่อไม่พบข้อมูล -->
              <tr v-if="filteredMaterials.length === 0">
                <td colspan="5" class="text-center text-gray-500">
                  ❌ ไม่พบข้อมูลที่ตรงกับคำค้นหา
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </userLayouts>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto; /* เลื่อนแนวนอนได้บนจอเล็ก */
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Kanit", sans-serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.table th,
.table td {
  padding: 12px; /* ลด Padding เพื่อประหยัดพื้นที่ */
  border: 1px solid #e0e0e0;
  text-align: center;
  background-color: #ffffff;
  transition: background-color 0.3s ease-in-out;
  font-size: 16px; /* ขนาดฟอนต์ปกติ */
}

.table th {
  background: linear-gradient(to bottom, #f4f4f4, #e2e2e2);
  font-weight: bold;
  color: #333333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #cccccc;
}

.table td img {
  display: block; /* ทำให้ภาพจัดกึ่งกลางในแนวนอน */
  margin: 0 auto; /* จัดภาพให้อยู่กึ่งกลาง */
  max-width: 64px; /* กำหนดขนาดสูงสุดของภาพ */
  max-height: 64px;
  border-radius: 10%; /* รูปภาพเป็นวงกลม */
  object-fit: cover; /* ป้องกันภาพผิดรูป */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table td:nth-child(2) {
  text-align: center; /* จัดให้อยู่ตรงกลาง */
  vertical-align: middle; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
}

/* Responsive Design สำหรับจอเล็ก */
@media (max-width: 768px) {
  .table th,
  .table td {
    padding: 8px; /* ลด Padding */
    font-size: 14px; /* ลดขนาดฟอนต์ */
  }
}

@media (max-width: 480px) {
  .table th,
  .table td {
    padding: 6px; /* ลด Padding เพิ่มเติม */
    font-size: 12px; /* ลดขนาดฟอนต์เพิ่มเติม */
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
</style>
//sparepartslist//user
