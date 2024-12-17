<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา

// Computed Property สำหรับกรองข้อมูล
//const filteredMaterials = computed(() => {
//  if (!searchQuery.value) return materials.value; // ถ้าไม่มีคำค้นหา แสดงข้อมูลทั้งหมด
//  return materials.value.filter(
   // (material) =>
    //  material.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    //  material.partnumber.toLowerCase().includes(searchQuery.value.toLowerCase())
 // );
//});

//onMounted(() => {
//  fetchMaterials();
//});
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto">
      <!-- ปุ่มเพิ่มรายการ และ ช่องค้นหา แนวนอน -->
      <div class="flex justify-between items-center mb-4 gap-4">
        <!-- ปุ่มเพิ่มรายการ -->
        <RouterLink
          to="/material"
          class="bg-green-500 rounded-lg w-full py-3 cursor-pointer transform transition duration-200 ease-in-out shadow-md hover:shadow-lg hover:bg-green-600 active:scale-95 active:bg-green-700 flex items-center justify-center"
        >
          <div class="flex gap-2 items-center">
            <div class="transform transition duration-200 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <p class="text-white font-bold text-lg">เพิ่มไฟล์เอกซ์เซล (PR)</p>
          </div>
        </RouterLink>

        <!-- ช่องค้นหา -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา"
          class="w-1/2 p-3 border border-gray-300 rounded-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
        />  

        <RouterLink
          to="/material"
          class="bg-green-500 rounded-lg w-full py-3 cursor-pointer transform transition duration-200 ease-in-out shadow-md hover:shadow-lg hover:bg-green-600 active:scale-95 active:bg-green-700 flex items-center justify-center"
        >
          <div class="flex gap-2 items-center">
            <div class="transform transition duration-200 hover:scale-110 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <p class="text-white font-bold text-lg">เพิ่มไฟล์เอกซ์เซล (PO)</p>
          </div>
        </RouterLink>
      </div>

      <div class="flex gap-4">
        <div class=" justify-center w-full h-[680px] overflow-x-auto">
          <div class="bg-slate-300 p-4 rounded-xl">
            <div class="overflow-x-auto">
              <div class="bg-white w-full p-3 text-center rounded-xl font-extrabold text-2xl ">PR</div>
            </div>
          </div>
        </div>
        <div class=" justify-center w-full h-[680px] overflow-x-auto">
          <div class="bg-slate-300 p-4 rounded-xl">
            <div class="overflow-x-auto">
              <div class="bg-white w-full p-3 text-center rounded-xl font-extrabold text-2xl ">PO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>

</style>
