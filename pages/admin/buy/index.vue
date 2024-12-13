<script setup>
import { ref } from 'vue';
import adminLayouts from '~/layouts/adminLayouts.vue';

const file = ref(null);

const uploadFile = async (event) => {
  const formData = new FormData();
  formData.append('file', event.target.files[0]);

  try {
    const response = await fetch('http://localhost:3000/admin/hire/PRupload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log(result.message);  // หรือการแสดงข้อความที่ได้รับจาก API
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
</script>

<template>
  <adminLayouts>
    <div>
      <input type="file" @change="uploadFile" />
    </div>
  </adminLayouts>
</template>

<style scoped>
/* ใส่สไตล์เพิ่มเติมตามต้องการ */
</style>