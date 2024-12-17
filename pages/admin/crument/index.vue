<template>
  <adminLayouts>
    <div>
      <form @submit.prevent="uploadFile">
        <input type="file" ref="fileInput" />
        <button class="btn" type="submit">Upload File</button>
      </form>
      <div v-if="uploadedFile">
        <p>Uploaded File:</p>
        <p>Name: {{ uploadedFile.name }}</p>
        <p>Path: {{ uploadedFile.path }}</p>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

import axios from "axios";

const fileInput = ref(null);
const uploadedFile = ref(null);

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  if (!file) return alert("Please select a file!");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axios.post("/api/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    uploadedFile.value = data.file;
  } catch (error) {
    console.error("File upload failed:", error);
  }
};
</script>
