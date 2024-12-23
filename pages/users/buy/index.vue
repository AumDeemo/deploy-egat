<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/userLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedFilePR = ref(null);
const selectedFilePO = ref(null);
const prFiles = ref([]); // ใช้เก็บข้อมูล PR
const poFiles = ref([]); // ใช้เก็บข้อมูล PO

// ดึงข้อมูล PR จาก API
const fetchPRFiles = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/pr/prfile");

    if (error.value) {
      console.error("Error fetching PR files:", error.value);
    } else {
      prFiles.value = data.value; // เก็บข้อมูลที่ได้
    }
  } catch (error) {
    console.error("Error fetching PR files:", error);
  }
};

// ดึงข้อมูล PO จาก API
const fetchPOFiles = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/po/pofile");

    if (error.value) {
      console.error("Error fetching PO files:", error.value);
    } else {
      poFiles.value = data.value; // เก็บข้อมูลที่ได้
    }
  } catch (error) {
    console.error("Error fetching PO files:", error);
  }
};
// Computed Properties สำหรับการค้นหา
const filteredPRFiles = computed(() =>
  prFiles.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const filteredPOFiles = computed(() =>
  poFiles.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
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
    message.value = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFilePO.value);

  try {
    const response = await fetch("/api/admin/po/pofile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    const data = await response.json();
    alert("สำเร็จ");
  } catch (error) {
    console.error(error);
  }
};

const handleUploadPR = async () => {
  if (!selectedFilePR.value) {
    message.value = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFilePR.value);

  try {
    const response = await fetch("/api/admin/pr/prfile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    const data = await response.json();
    alert("สำเร็จ");
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchPRFiles();
  await fetchPOFiles();
  console.log("dataPR : ", prFiles.value);
});
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <!-- ส่วนช่องค้นหา -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาไฟล์..."
          class="w-full p-4 border border-gray-300 rounded-lg text-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      <!-- ตารางแสดงข้อมูล PR และ PO -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- PR Table -->
        <div class="w-full bg-white rounded-lg shadow-lg p-4">
          <h2
            class="text-xl sm:text-2xl font-bold text-center text-gray-700 bg-blue-100 py-2 rounded-md mb-4"
          >
            รายการ PR
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full table-auto border-collapse text-sm sm:text-base">
              <thead>
                <tr class="bg-blue-500 text-white">
                  <th class="p-2 sm:p-3 text-left rounded-tl-lg">ชื่อไฟล์</th>
                  <th class="p-2 sm:p-3 text-center rounded-tr-lg">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPRFiles"
                  :key="file.id"
                  class="hover:bg-blue-50 transition"
                >
                  <td class="p-2 sm:p-3 border-b text-gray-700 flex items-center gap-2">
                    <!-- ไอคอน Excel -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      fill="none"
                      class="w-6 h-6"
                    >
                      <rect width="48" height="48" rx="6" fill="#107C41" />
                      <path
                        d="M14 12C12.8954 12 12 12.8954 12 14V34C12 35.1046 12.8954 36 14 36H34C35.1046 36 36 35.1046 36 34V14C36 12.8954 35.1046 12 34 12H14Z"
                        fill="#33C481"
                      />
                      <path
                        d="M18 17.3438C18 17.0207 18.2442 16.7765 18.5673 16.7765H20.3279C20.5886 16.7765 20.8238 16.9302 20.9465 17.1635L23.2263 21.6766L25.5061 17.1635C25.6288 16.9302 25.864 16.7765 26.1248 16.7765H27.8853C28.2084 16.7765 28.4526 17.0207 28.4526 17.3438C28.4526 17.4671 28.4176 17.5867 28.3536 17.6877L24.7861 24L28.3536 30.3123C28.4176 30.4133 28.4526 30.5329 28.4526 30.6562C28.4526 30.9793 28.2084 31.2235 27.8853 31.2235H26.1248C25.864 31.2235 25.6288 31.0698 25.5061 30.8365L23.2263 26.3234L20.9465 30.8365C20.8238 31.0698 20.5886 31.2235 20.3279 31.2235H18.5673C18.2442 31.2235 18 30.9793 18 30.6562C18 30.5329 18.035 30.4133 18.099 30.3123L21.6665 24L18.099 17.6877C18.035 17.5867 18 17.4671 18 17.3438Z"
                        fill="white"
                      />
                    </svg>
                    {{ file.name }}
                  </td>
                  <td class="p-2 sm:p-3 border-b text-center">
                    <!-- ปุ่มดาวน์โหลด -->
                    <a
                      :href="file.path"
                      :download="file.name"
                      class="bg-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-md hover:bg-yellow-600 transition"
                    >
                      ดาวน์โหลดไฟล์
                    </a>
                  </td>
                </tr>
                <tr v-if="filteredPRFiles.length === 0">
                  <td colspan="2" class="p-3 text-center text-gray-500">ไม่มีไฟล์ PR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PO Table -->
        <div class="w-full bg-white rounded-lg shadow-lg p-4">
          <h2
            class="text-xl sm:text-2xl font-bold text-center text-gray-700 bg-green-100 py-2 rounded-md mb-4"
          >
            รายการ PO
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full table-auto border-collapse text-sm sm:text-base">
              <thead>
                <tr class="bg-green-500 text-white">
                  <th class="p-2 sm:p-3 text-left rounded-tl-lg">ชื่อไฟล์</th>
                  <th class="p-2 sm:p-3 text-center rounded-tr-lg">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPOFiles"
                  :key="file.id"
                  class="hover:bg-green-50 transition"
                >
                  <td class="p-2 sm:p-3 border-b text-gray-700 flex items-center gap-2">
                    <!-- ไอคอน Excel -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      fill="none"
                      class="w-6 h-6"
                    >
                      <rect width="48" height="48" rx="6" fill="#107C41" />
                      <path
                        d="M14 12C12.8954 12 12 12.8954 12 14V34C12 35.1046 12.8954 36 14 36H34C35.1046 36 36 35.1046 36 34V14C36 12.8954 35.1046 12 34 12H14Z"
                        fill="#33C481"
                      />
                      <path
                        d="M18 17.3438C18 17.0207 18.2442 16.7765 18.5673 16.7765H20.3279C20.5886 16.7765 20.8238 16.9302 20.9465 17.1635L23.2263 21.6766L25.5061 17.1635C25.6288 16.9302 25.864 16.7765 26.1248 16.7765H27.8853C28.2084 16.7765 28.4526 17.0207 28.4526 17.3438C28.4526 17.4671 28.4176 17.5867 28.3536 17.6877L24.7861 24L28.3536 30.3123C28.4176 30.4133 28.4526 30.5329 28.4526 30.6562C28.4526 30.9793 28.2084 31.2235 27.8853 31.2235H26.1248C25.864 31.2235 25.6288 31.0698 25.5061 30.8365L23.2263 26.3234L20.9465 30.8365C20.8238 31.0698 20.5886 31.2235 20.3279 31.2235H18.5673C18.2442 31.2235 18 30.9793 18 30.6562C18 30.5329 18.035 30.4133 18.099 30.3123L21.6665 24L18.099 17.6877C18.035 17.5867 18 17.4671 18 17.3438Z"
                        fill="white"
                      />
                    </svg>
                    {{ file.name }}
                  </td>
                  <td class="p-2 sm:p-3 border-b text-center">
                    <!-- ปุ่มดาวน์โหลด -->
                    <a
                      :href="file.path"
                      :download="file.name"
                      class="bg-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-md hover:bg-yellow-600 transition"
                    >
                      ดาวน์โหลดไฟล์
                    </a>
                  </td>
                </tr>
                <tr v-if="filteredPOFiles.length === 0">
                  <td colspan="2" class="p-3 text-center text-gray-500">ไม่มีไฟล์ PO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>
