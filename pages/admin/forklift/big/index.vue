<template>
  <adminLayouts>
    <!-- ปุ่มเพิ่มข้อมูล -->
    <div class="flex justify-center w-full mb-4 ">
      <button
        @click="openModal"
        class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
      >
        + เพิ่มข้อมูลรถ
      </button>
    </div>

    <!-- Container หลัก -->
    <div
      class="flex flex-col items-center gap-8 p-6 bg-gradient-to-b from-gray-50 to-gray-200 rounded-2xl shadow-xl h-full overflow-y-auto"
    >
      <!-- Fork Lift ขนาดใหญ่ -->
      <section class="w-full lg:w-3/4 flex flex-col items-center text-center p-6 border-t-4 border-gray-800 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300">
        <!-- รายละเอียดรถ -->
        <h1 class="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-4">
          Fork Lift
        </h1>
      </section>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">เพิ่มข้อมูลรถ</h2>

        <!-- ฟอร์มป้อนข้อมูล -->
        <form @submit.prevent="submitForm">
          <!-- Input Fields -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">แบรนด์</label>
            <input
              v-model="formData.brand"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="กรอกแบรนด์รถ"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">รุ่น</label>
            <input
              v-model="formData.model"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="กรอกรุ่นรถ"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">น้ำหนัก</label>
            <input
              v-model="formData.weight"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="กรอกน้ำหนักรถ"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">รหัสกฟผ</label>
            <input
              v-model="formData.code"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="กรอกรหัส กฟผ."
            />
          </div>

          <!-- อัปโหลดรูปภาพ -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">อัปโหลดรูปภาพ</label>
            <input
              type="file"
              @change="onFileChange"
              accept="image/*"
              class="w-full"
            />
            <div v-if="formData.imagePreview" class="mt-4">
              <img
                :src="formData.imagePreview"
                alt="Preview"
                class="w-full h-48 object-cover rounded-lg shadow"
              />
            </div>
          </div>

          <!-- ปุ่มบันทึกและยกเลิก -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

// State สำหรับ Modal
const isModalOpen = ref(false);

// ข้อมูลฟอร์ม
const formData = ref({
  brand: "",
  model: "",
  weight: "",
  code: "",
  image: null,
  imagePreview: null,
});

// ฟังก์ชันเปิดและปิด Modal
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

// ฟังก์ชันรีเซ็ตฟอร์ม
const resetForm = () => {
  formData.value = {
    brand: "",
    model: "",
    weight: "",
    code: "",
    image: null,
    imagePreview: null,
  };
};

// ฟังก์ชันจัดการไฟล์รูปภาพ
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
    formData.value.imagePreview = URL.createObjectURL(file);
  }
};

// ฟังก์ชันบันทึกข้อมูล
const submitForm = () => {
  console.log("ข้อมูลที่บันทึก:", formData.value);
  closeModal();
};
</script>

<style scoped>
/* ปรับแต่ง Scrollbar */
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
