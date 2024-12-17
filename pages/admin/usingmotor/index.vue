<template>
    <adminLayouts>
      <!-- หัวข้อ -->
      <h1 class="text-center text-5xl font-extrabold text-gray-800 tracking-wider mb-10 mt-10">
        เครื่องจักรที่รับผิดชอบ
      </h1>
  
      <!-- ภาพและ Modal -->
      <div class="mt-10 flex justify-center items-center space-x-10">
        <!-- รูปที่ 1 -->
        <div @click="openModal('DOOSAN Fork Lift', 'รายละเอียดรถ DOOSAN ...', '/imgture/IMG_2837.jpeg')">
          <img
            src="/imgture/IMG_2837.jpeg"
            class="w-[250px] h-[200px] rounded-xl hover:opacity-75 transition duration-200 cursor-pointer"
            alt="DOOSAN Fork Lift"
          />
          <p class="text-center mt-3 text-xl font-semibold text-gray-700">(DOOSAN) Fork Lift</p>
        </div>
  
        <!-- รูปที่ 2 -->
        <div @click="openModal('LIUGONG Fork Lift', 'รายละเอียดรถ LIUGONG ...', '/imgture/IMG_2835.jpeg')">
          <img
            src="/imgture/IMG_2835.jpeg"
            class="w-[250px] h-[200px] rounded-xl hover:opacity-75 transition duration-200 cursor-pointer"
            alt="LIUGONG Fork Lift"
          />
          <p class="text-center mt-3 text-xl font-semibold text-gray-700">(LIUGONG) Fork Lift</p>
        </div>
  
        <!-- รูปที่ 3 -->
        <div @click="openModal('ATTACK Fork Lift', 'รายละเอียดรถ ATTACK ...', '/imgture/IMG_2836.jpeg')">
          <img
            src="/imgture/IMG_2836.jpeg"
            class="w-[250px] h-[200px] rounded-xl hover:opacity-75 transition duration-200 cursor-pointer"
            alt="ATTACK Fork Lift"
          />
          <p class="text-center mt-3 text-xl font-semibold text-gray-700">(ATTACK) Fork Lift</p>
        </div>
      </div>
  
      <!-- Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md text-center relative">
          <button
            @click="closeModal"
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
          <!-- รูปใน Modal -->
          <img 
            v-if="modalImage"
            :src="modalImage" 
            alt="Fork Lift Image" 
            class="w-full h-[200px] rounded-md mb-4"
          />
          <!-- ข้อมูลใน Modal -->
          <h2 class="text-2xl font-bold text-gray-800 mb-3">{{ modalTitle }}</h2>
          <p class="text-gray-600">{{ modalDescription }}</p>
        </div>
      </div>
    </adminLayouts>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import adminLayouts from '~/layouts/adminLayouts.vue';
  
  // State สำหรับ Modal
  const isModalOpen = ref(false);
  const modalTitle = ref('');
  const modalDescription = ref('');
  const modalImage = ref('');
  
  // ฟังก์ชันเปิด Modal พร้อมข้อมูลที่ส่งมา
  const openModal = (title, description, image) => {
    modalTitle.value = title;
    modalDescription.value = description;
    modalImage.value = image;
    console.log('Modal Image Path:', modalImage.value); // ตรวจสอบ path ที่ส่งมา
    isModalOpen.value = true;
  };
  
  // ฟังก์ชันปิด Modal
  const closeModal = () => {
    isModalOpen.value = false;
  };
  </script>
  
  <style scoped>
  /* ปรับแต่ง Modal ให้มีความสวยงาม */
  .fixed {
    backdrop-filter: blur(5px);
  }
  </style>
  