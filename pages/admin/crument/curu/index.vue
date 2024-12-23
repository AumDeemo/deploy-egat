<template>
  <adminLayouts>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- ส่วนหัว -->
      <div class="bg-blue-600 text-white rounded-lg px-6 py-4 shadow-lg mb-6">
        <h1 class="text-3xl font-bold text-center">ระบบจัดการข้อมูลคุรุภัณฑ์</h1>
        <p class="text-center text-sm mt-2">การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)</p>
      </div>

      <!-- ฟอร์มค้นหาและอัปโหลดไฟล์ -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <!-- ช่องค้นหา -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาไฟล์..."
            class="w-full lg:flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- ฟอร์มอัปโหลดไฟล์ -->
          <form @submit.prevent="handleUploadCURU" class="flex-1 flex items-center gap-4">
            <input
              type="file"
              @change="handleFileUploadCURU"
              accept=".xls,.xlsx"
              class="w-full lg:w-auto flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              class="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
            >
              อัปโหลดไฟล์
            </button>
          </form>
        </div>
      </div>

      <!-- ตาราง -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">รายการคุรุภัณฑ์</h2>
        <div class="overflow-x-auto">
          <table
            class="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm"
          >
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="p-4 text-left font-semibold text-gray-600 border-b border-gray-300"
                >
                  ชื่อไฟล์
                </th>
                <th
                  class="p-4 text-center font-semibold text-gray-600 border-b border-gray-300"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="file in filteredCURU"
                :key="file.id"
                class="hover:bg-gray-50 transition duration-200"
              >
                <td class="p-4 text-gray-800 border-b border-gray-300">
                  {{ file.name }}
                </td>
                <td class="p-4 text-center flex justify-center items-center gap-4">
                  <!-- ปุ่มเปิดดาวน์โหลด -->
                  <button
                    :href="file.path"
                    :download="file.name"
                    class="download-btn flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 2a1 1 0 00-1 1v7H7a1 1 0 100 2h6a1 1 0 100-2h-2V3a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M4 12a1 1 0 011-1h10a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    ดาวน์โหลด
                  </button>

                  <!-- ปุ่ม Preview -->
                  <button
                    @click="openPreview(file)"
                    class="preview-btn flex items-center gap-1"
                  >
                    Preview
                  </button>

                  <!-- ปุ่มลบไฟล์ -->
                  <button
                    @click="deleteCURU(file.id)"
                    class="delete-btn flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 13h6m2 8H7a2 2 0 01-2-2V7h14v12a2 2 0 01-2 2zM10 5h4a2 2 0 00-2-2 2 2 0 00-2 2z"
                      />
                    </svg>
                    ลบ
                  </button>
                </td>
              </tr>
              <tr v-if="filteredCURU.length === 0">
                <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Modal สำหรับ Preview -->
      <div
        v-if="previewFile"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative">
          <button @click="closePreview" class="absolute top-2 right-2 text-gray-600">
            ✕
          </button>
          <div v-if="previewFile.type === 'image'">
            <img :src="previewFile.url" alt="Preview" class="max-w-full h-auto mx-auto" />
          </div>
          <div
            v-else-if="previewFile.type === 'pdf'"
            class="overflow-y-auto max-h-[80vh]"
          >
            <embed :src="previewFile.url" type="application/pdf" class="w-full h-full" />
          </div>
          <div
            v-else-if="previewFile.type === 'office'"
            class="overflow-y-auto max-h-[80vh]"
          >
            <iframe
              :src="previewFile.url"
              frameborder="0"
              class="w-full h-full"
              allowfullscreen
            ></iframe>
          </div>
          <div v-else>
            <p class="text-center text-gray-500">ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้</p>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedCURU = ref(null);
const CURU = ref([]); // ใช้เก็บข้อมูล
const previewFile = ref(null);

// ฟิลเตอร์ไฟล์ตามคำค้นหา
const filteredCURU = computed(() => {
  if (!searchQuery.value) {
    return CURU.value; // แสดงทั้งหมดถ้าไม่มีคำค้นหา
  }
  return CURU.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// ดึงข้อมูลจาก API
const fetchCURU = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/crument/curu/curu");

    if (error.value) {
      console.error("Error fetching CURU files:", error.value);
    } else {
      CURU.value = data.value; // เก็บข้อมูลที่ได้
    }
  } catch (error) {
    console.error("Error fetching CURU files:", error);
  }
};

const handleFileUploadCURU = (event) => {
  selectedCURU.value = event.target.files[0];
  console.log("Selected CURU File:", selectedCURU.value);
};

const handleUploadCURU = async () => {
  if (!selectedCURU.value) {
    alert("Please select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedCURU.value);

  try {
    const response = await fetch("/api/admin/crument/curu/curu", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    const data = await response.json();
    alert("Upload Successful");
    fetchCURU();
  } catch (error) {
    console.error(error);
  }
};

const deleteCURU = async (id) => {
  if (confirm("คุณแน่ใจว่าจะลบไฟล์นี้?")) {
    try {
      const response = await fetch("/api/admin/crument/curu/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      alert("ไฟล์ถูกลบสำเร็จ");
      fetchCURU();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  }
};
// ฟังก์ชันเปิด Preview
const openPreview = (file) => {
  const extension = file.name.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png"].includes(extension)) {
    // แสดงรูปภาพ
    previewFile.value = { type: "image", url: file.path };
  } else if (extension === "pdf") {
    // แสดง PDF
    previewFile.value = { type: "pdf", url: file.path };
  } else if (["docx", "xlsx", "pptx"].includes(extension)) {
    // แสดงไฟล์ Office ผ่าน Microsoft Office Viewer
    previewFile.value = {
      type: "office",
      url: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        file.path
      )}`,
    };
  } else {
    // ไม่รองรับ
    previewFile.value = { type: "unknown" };
  }
};

// ฟังก์ชันปิด Preview
const closePreview = () => {
  previewFile.value = null;
};
onMounted(async () => {
  await fetchCURU();
  console.log("CURU Data:", CURU.value);
});
</script>

<style scoped>
/* General Styles */
input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px #007bff;
}

button {
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

/* ปุ่มดาวน์โหลด */
.download-btn {
  background-color: #28a745; /* สีเขียว */
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.download-btn:hover {
  background-color: #218838; /* สีเขียวเข้ม */
}

.download-btn:active {
  transform: scale(0.98);
}

/* ปุ่มลบ */
.delete-btn {
  background-color: #e11d48; /* สีแดง */
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #be123c; /* สีแดงเข้ม */
}

.delete-btn:active {
  transform: scale(0.98);
}

/* ตาราง */
.table-auto {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.table-auto th,
.table-auto td {
  padding: 12px 16px;
  text-align: center;
  border: 1px solid #d1d5db;
}

.table-auto th {
  background-color: #007bff;
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
}

.table-auto td {
  background-color: #ffffff;
  font-size: 14px;
  color: #4b5563;
  text-align: center;
  vertical-align: middle;
}

.table-auto tr:nth-child(even) td {
  background-color: #f3f4f6;
}

.table-auto tr:hover td {
  background-color: #e0f2fe;
}

/* Responsive Design */
@media (max-width: 768px) {
  input {
    font-size: 14px;
    padding: 8px;
  }

  .download-btn,
  .delete-btn {
    font-size: 12px;
    padding: 8px 16px;
  }

  .table-auto th,
  .table-auto td {
    font-size: 12px;
    padding: 10px 12px;
  }
}

a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

a:active {
  transform: translateY(0);
}

.overflow-y-auto {
  overflow-y: auto;
}

.max-h-96 {
  max-height: 24rem;
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}
</style>
