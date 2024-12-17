<template>
  <adminLayouts>
    <div>
      <form @submit.prevent="uploadFile" >
        <input type="file" ref="fileInput" />
        <button type="submit">Upload File</button>
      </form>
      
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from 'vue';
import adminLayouts from '~/layouts/adminLayouts.vue';

const fileInput = ref(null);

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('File ready to upload:', file);

    try {
      const response = await $fetch('/api/files/crumentupload', {
        method: 'POST',
        body: formData,
      });
      console.log('Response from server:', response);
    } catch (error) {
      console.error('Error during upload:', error.message);
    }
  } else {
    console.error('No file selected');
  }
};
</script>

