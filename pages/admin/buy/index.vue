<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedFilePR = ref(null);
const selectedFilePO = ref(null);

const handleFileUploadPR = (event) => {
  selectedFilePR.value = event.target.files[0];
  console.log("Selected PR File:", selectedFilePR.value);
};

const handleFileUploadPO = (e) => {
  selectedFilePO.value = e.target.files[0];
  console.log("Selected PO File:", selectedFilePO.value);
};

const handleUploadPO = async () => {

  if (!selectedFilePO.value) {
    message.value = 'Please select a file.';
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFilePO.value);

  try {
    const response = await fetch('/api/admin/po/pofile', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed.');
    }

    const data = await response.json();
    alert('สำเร็จ')
  } catch (error) {
    console.error(error);
  }
};

const handleUploadPR = async () => {

  if (!selectedFilePR.value) {
    message.value = 'Please select a file.';
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFilePR.value);

  try {
    const response = await fetch('/api/admin/pr/prfile', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed.');
    }

    const data = await response.json();
    alert('สำเร็จ')
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto">
      <!-- ปุ่มเพิ่มรายการ และ ช่องค้นหา แนวนอน -->
      <div class="flex justify-between items-center mb-4 gap-4">
        <!-- ปุ่มเพิ่มไฟล์ PR -->
        <form @submit.prevent="handleUploadPR">
          <input type="file" @change="handleFileUploadPR" accept=".xls,.xlsx" />
          <button type="submit" class="btn">Upload File</button>
        </form>

        <!-- ช่องค้นหา -->
        <input v-model="searchQuery" type="text" placeholder="ค้นหา"
          class="w-1/2 p-3 border border-gray-300 rounded-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out" />

        <!-- ปุ่มเพิ่มไฟล์ PO -->
        <form @submit.prevent="handleUploadPO">
          <input type="file" @change="handleFileUploadPO" accept=".xls,.xlsx" />
          <button type="submit" class="btn">Upload File</button>
        </form>
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
