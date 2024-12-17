<template>
  <adminLayouts>
    <!-- Container หลัก -->
    <div
      class="flex flex-col items-center gap-8 p-6 bg-gradient-to-b from-gray-50 to-gray-200 rounded-2xl shadow-xl h-full overflow-y-auto"
    >
      <!-- Fork Lift ขนาดใหญ่ -->
      <section
        class="w-full lg:w-3/4 flex flex-col items-center text-center p-6 border-t-4 border-gray-800 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300"
      >
        <h1 class="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-4">
          Fork Lift ขนาดใหญ่
        </h1>
        <div class="relative overflow-hidden rounded-lg shadow-lg mb-4">
          <img
            src="/imgture/IMG_2837.jpeg"
            alt="Fork Lift Large"
            class="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div class="grid grid-cols-2 gap-y-2 text-lg text-gray-700 w-full">
          <span class="font-semibold text-gray-900">แบรนด์:</span><span>DOOSAN</span>
          <span class="font-semibold text-gray-900">รุ่น:</span><span>DX150</span>
          <span class="font-semibold text-gray-900">น้ำหนัก:</span><span>15 ตัน</span>
          <span class="font-semibold text-gray-900">รหัสกฟผ:</span
          ><span>51-0234 ผม.</span>
        </div>
      </section>

      <!-- Fork Lift ขนาดกลาง -->
      <section
        class="w-full lg:w-3/4 flex flex-col items-center text-center p-6 border-t-4 border-gray-700 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300"
      >
        <h1 class="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-4">
          Fork Lift ขนาดกลาง
        </h1>
        <div class="relative overflow-hidden rounded-lg shadow-lg mb-4">
          <img
            src="/imgture/IMG_2835.jpeg"
            alt="Fork Lift Medium"
            class="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div class="grid grid-cols-2 gap-y-2 text-lg text-gray-700 w-full">
          <span class="font-semibold text-gray-900">แบรนด์:</span><span>TOYOTA</span>
          <span class="font-semibold text-gray-900">รุ่น:</span><span>8FG30</span>
          <span class="font-semibold text-gray-900">น้ำหนัก:</span><span>3 ตัน</span>
          <span class="font-semibold text-gray-900">รหัสกฟผ:</span
          ><span>51-0235 ผม.</span>
        </div>
      </section>

      <!-- Fork Lift ขนาดเล็ก -->
      <section
        class="w-full lg:w-3/4 flex flex-col items-center text-center p-6 border-t-4 border-gray-600 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300"
      >
        <h1 class="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-4">
          Fork Lift ขนาดเล็ก
        </h1>
        <div class="relative overflow-hidden rounded-lg shadow-lg mb-4">
          <img
            src="/imgture/IMG_2836.jpeg"
            alt="Fork Lift Small"
            class="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div class="grid grid-cols-2 gap-y-2 text-lg text-gray-700 w-full">
          <span class="font-semibold text-gray-900">แบรนด์:</span><span>NISSAN</span>
          <span class="font-semibold text-gray-900">รุ่น:</span><span>1F1</span>
          <span class="font-semibold text-gray-900">น้ำหนัก:</span><span>1.5 ตัน</span>
          <span class="font-semibold text-gray-900">รหัสกฟผ:</span
          ><span>51-0236 ผม.</span>
        </div>
      </section>
    </div>
  </adminLayouts>
</template>

<script setup>
import adminLayouts from "~/layouts/adminLayouts.vue";
</script>

<style scoped>
/* Scrollbar แบบพรีเมียม */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: #e5e7eb;
}

div::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 8px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
