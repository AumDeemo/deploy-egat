<script setup>
import { ref, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedFilePR = ref(null);
const selectedFilePO = ref(null);
const prFiles = ref([]);  // ใช้เก็บข้อมูล PR
const poFiles = ref([]);  // ใช้เก็บข้อมูล PO

// ดึงข้อมูล PR จาก API
const fetchPRFiles = async () => {
  try {
    const { data, error } = await useFetch('/api/admin/pr/prfile');

    if (error.value) {
      console.error('Error fetching PR files:', error.value);
    } else {
      prFiles.value = data.value;  // เก็บข้อมูลที่ได้
    }
  } catch (error) {
    console.error('Error fetching PR files:', error);
  }
};


// ดึงข้อมูล PO จาก API
const fetchPOFiles = async () => {
  try {
    const { data, error } = await useFetch('/api/admin/po/pofile');

    if (error.value) {
      console.error('Error fetching PO files:', error.value);
    } else {
      poFiles.value = data.value;  // เก็บข้อมูลที่ได้
    }
  } catch (error) {
    console.error('Error fetching PO files:', error);
  }
};

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

// ลบไฟล์ PR
const deletePRFile = async (id) => {
  if (confirm('คุณแน่ใจว่าจะลบไฟล์นี้?')) {
    try {
      const response = await fetch('/api/admin/pr/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const data = await response.json();
      alert('ไฟล์ถูกลบสำเร็จ');
      fetchPRFiles();  // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('เกิดข้อผิดพลาดในการลบไฟล์');
    }
  }
};

// ลบไฟล์ PO
const deletePOFile = async (id) => {
  if (confirm('คุณแน่ใจว่าจะลบไฟล์นี้?')) {
    try {
      const response = await fetch('/api/admin/po/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const data = await response.json();
      alert('ไฟล์ถูกลบสำเร็จ');
      fetchPRFiles();  // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('เกิดข้อผิดพลาดในการลบไฟล์');
    }
  }
};

onMounted(async () => {
  await fetchPRFiles();
  await fetchPOFiles();
  console.log('dataPR : ' , prFiles.value)
});
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
              <table class="min-w-full table-auto">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="p-2 text-left">File Name</th>
                    <th class="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="file in prFiles" :key="file.id">
                    <td class="p-2">{{ file.name }}</td>
                    <td class="p-2">
                      <!-- ปุ่มสำหรับดาวน์โหลดหรือเปิดไฟล์ -->
                      <a :href="file.path" class="text-blue-500 hover:text-blue-700" target="_blank">เปิดไฟล์</a>
                      <!-- ปุ่มลบไฟล์ -->
                      <button @click="deletePRFile(file.id)" class="ml-2 text-red-500 hover:text-red-700">ลบ</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class=" justify-center w-full h-[680px] overflow-x-auto">
          <div class="bg-slate-300 p-4 rounded-xl">
            <div class="overflow-x-auto">
              <div class="bg-white w-full p-3 text-center rounded-xl font-extrabold text-2xl ">PO</div>
              <table class="min-w-full table-auto">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="p-2 text-left">File Name</th>
                    <th class="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="file in poFiles" :key="file.id">
                    <td class="p-2">{{ file.name }}</td>
                    <td class="p-2">
                      <!-- ปุ่มสำหรับดาวน์โหลดหรือเปิดไฟล์ -->
                      <a :href="file.path" class="text-blue-500 hover:text-blue-700" target="_blank">เปิดไฟล์</a>
                      <!-- ปุ่มลบไฟล์ -->
                      <button @click="deletePOFile(file.id)" class="ml-2 text-red-500 hover:text-red-700">ลบ</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>
