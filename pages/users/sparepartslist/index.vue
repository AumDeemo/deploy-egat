<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted } from "vue";

const materials = ref([]);
const searchQuery = ref(""); // เก็บค่าคำค้นหา

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

// ดึงข้อมูลวัสดุเมื่อ component ถูก mounted
onMounted(() => {
  fetchMaterials();
});

// ฟิลเตอร์ข้อมูลตามคำค้นหา
const filteredMaterials = computed(() => {
  if (!searchQuery.value) return materials.value;
  return materials.value.filter(
    (material) =>
      material.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      material.partnumber.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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
    <!-- Materials Table -->
    <div class="mt-5 justify-center w-full h-[680px] overflow-x-auto">
      <div class="bg-slate-300 p-4 rounded-xl">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="text-[150px]">
                <th class="min-w-[50px]">ลำดับ</th>
                <th class="min-w-[150px]">รายการ</th>
                <th class="min-w-[150px]">PART NUMBER</th>
                <th class="min-w-[150px]">คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(material, index) in filteredMaterials" :key="material.id">
                <td>{{ index + 1 }}</td>
                <td>{{ material.name }}</td>
                <td>{{ material.partnumber }}</td>
                <td>{{ material.totalAmount }}</td>
              </tr>
              <!-- แสดงข้อความเมื่อไม่พบข้อมูล -->
              <tr v-if="filteredMaterials.length === 0">
                <td colspan="4" class="text-center text-gray-500">
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

.table td:nth-child(2) {
  text-align: left;
  padding-left: 16px;
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
