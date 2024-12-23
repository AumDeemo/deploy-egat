<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted, computed } from "vue";

const materials = ref([]);
const searchQuery = ref(""); // เก็บค่าคำค้นหา
const selectedCategory = ref(""); // เก็บค่าหมวดหมู่ที่เลือก
const categories = ref([]); // รายการหมวดหมู่ทั้งหมด

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
    const response = await fetch("/api/admin/new/category", { method: "GET" });
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    console.error(err.message);
  }
};

// กรองวัสดุตามหมวดหมู่และคำค้นหา
const filteredMaterials = computed(() => {
  let filtered = materials.value;
  
  // กรองตามหมวดหมู่ที่เลือก
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (material) => material.category === selectedCategory.value
    );
  }

  // กรองตามคำค้นหาหลายคำที่พิมพ์ (ค้นหาจากชื่อวัสดุและหมวดหมู่)
  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" "); // แยกคำค้นหา

    filtered = filtered.filter((material) => {
      // ตรวจสอบทุกคำในคำค้นหาที่ถูกแยก
      return searchTerms.every((term) => {
        return (
          (material.name?.toLowerCase().includes(term)) || // ค้นหาจากชื่อวัสดุ
          (material.category?.toLowerCase().includes(term)) || // ค้นหาจากหมวดหมู่
          (material.partnumber?.toLowerCase().includes(term))   // ค้นหาจาก Part Number
        );
      });
    });
  }

  console.log(filtered); // ตรวจสอบผลลัพธ์ที่ถูกกรอง
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
      <!-- Dropdown หมวดหมู่ -->
      <select
        v-model="selectedCategory"
        class="w-full md:w-1/4 p-3 border border-gray-300 rounded-full shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400"
      >
        <option value="">ทั้งหมด</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
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
</style>
