<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted } from "vue";

const materials = ref([]);

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
</script>

<template>
  <userLayouts>
    
    <!-- Materials Table -->
    <div class="mt-5 justify-center w-full h-[680px] overflow-x-auto">
      <div class="bg-slate-300 p-4 rounded-xl">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="text-[150px]">
                <th></th>
                <th class="min-w-[150px]">รายการ</th>
                <th class="min-w-[150px]">PART NUMBER</th>
                <th class="min-w-[150px]">คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="material in materials" :key="material.id">
                <td>{{ material.id }}</td>
                <td>{{ material.name }}</td>
                <td>{{ material.partnumber }}</td>
                <td>{{ material.totalAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </userLayouts>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: #ffffff;
}

.table th {
  background-color: #f4f4f4;
  font-size: 20px;
  font-weight: 700;
}
</style>
