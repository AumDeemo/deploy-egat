<script setup>
import { ref } from 'vue';
import adminLayouts from '~/layouts/adminLayouts.vue';

const fileInput = ref(null);

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await $fetch('/api/crumentupload', {
        method: 'POST',
        body: formData,
      });
      console.log('File uploaded:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};
</script>

<template>
  <adminLayouts>
    <div>
      <form @submit.prevent="uploadFile">
        <input type="file" ref="fileInput" />
        <button type="submit">Upload File</button>
      </form>
      <div v-if="uploadResponse">
        <p>{{ uploadResponse.message }}</p>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
/* ใส่สไตล์เพิ่มเติมตามต้องการ */
</style>