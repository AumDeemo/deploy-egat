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
          <!-- เพิ่ม container ที่มี scroll -->
          <div class="overflow-y-auto max-h-60 rounded-lg border border-gray-300">
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
                      v-if="file.path"
                      @click="downloadFile(file)"
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

                    <!-- ปุ่ม Preview  Word -->
                    <button
                      v-if="file.name.endsWith('.doc') || file.name.endsWith('.docx')"
                      @click="previewWord(file)"
                      class="preview-btn flex items-center gap-1"
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
                      พรีวิว
                    </button>

                    <!-- ปุ่ม Preview  PDF -->
                    <button
                      v-if="file.name.endsWith('.pdf')"
                      @click="previewPDF(file)"
                      class="preview-btn flex items-center gap-1"
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
                      พรีวิว
                    </button>

                    <!-- ปุ่ม Preview excel-->
                    <button
                      v-if="file.name.endsWith('.xls') || file.name.endsWith('.xlsx')"
                      @click="previewExcelContent(file)"
                      class="preview-btn flex items-center gap-1"
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
                      พรีวิว
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
      </div>

      <!-- Modal -->
      <div
        v-if="isPreviewModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-11/12 max-w-5xl p-6 relative overflow-y-auto max-h-[85vh] border border-gray-300"
        >
          <!-- Header -->
          <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-bold text-gray-800">
              {{
                previewFileType === "pdf"
                  ? "PDF Preview"
                  : previewFileType === "excel"
                  ? "Excel Preview"
                  : previewFileType === "word"
                  ? "Word Preview"
                  : "Preview"
              }}
            </h3>
            <button
              @click="closePreviewModal"
              class="text-gray-500 hover:text-red-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div>
            <!-- Word Preview -->
            <div v-if="previewFileType === 'word'" class="word-preview">
              <div class="p-4 bg-white rounded shadow" v-html="previewContent"></div>
            </div>

            <!-- PDF Preview -->
            <div v-if="previewFileType === 'pdf'">
              <embed :src="previewFile.path" width="100%" height="600px" />
            </div>

            <!-- Excel Preview -->
            <div v-if="previewFileType === 'excel'">
              <table
                class="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden"
              >
                <thead class="bg-gray-200 text-gray-700">
                  <tr>
                    <th
                      v-for="(header, index) in previewContent[0]"
                      :key="index"
                      class="p-3 text-left font-medium border-b"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIndex) in previewContent.slice(1)"
                    :key="rowIndex"
                    class="even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td
                      v-for="(cell, cellIndex) in row"
                      :key="cellIndex"
                      class="p-3 text-gray-600 border-b whitespace-nowrap"
                    >
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end">
            <button
              @click="closePreviewModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";
import * as XLSX from "xlsx"; // Import the XLSX library

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedCURU = ref(null);
const CURU = ref([]); // ใช้เก็บข้อมูล
const previewFile = ref(null);
const previewContent = ref(null); // Store preview content
const isPreviewModalOpen = ref(false); // ใช้เพื่อควบคุมการเปิด/ปิด Modal
const previewFileType = ref(null);
import mammoth from "mammoth";

// ฟิลเตอร์ไฟล์ตามคำค้นหา
const filteredCURU = computed(() => {
  if (!searchQuery.value) {
    return CURU.value; // แสดงทั้งหมดถ้าไม่มีคำค้นหา
  }
  return CURU.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchCURU = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/crument/curu/curu");

    if (error.value) {
      console.error("Error fetching CURU files:", error.value);
    } else {
      // เพิ่ม path ให้เป็น URL ที่เข้าถึงไฟล์ใน public
      CURU.value = toRaw(data.value).map((file) => ({
        ...file,
        path: `/crument/curu/${file.name}`, // ใช้ URL จากโฟลเดอร์ public
      }));
    }
  } catch (error) {
    console.error("Error fetching CURU files:", error);
  }
};

const downloadFile = (file) => {
  const link = document.createElement("a");
  link.href = file.path;
  link.download = file.name; // ตั้งชื่อไฟล์ที่ดาวน์โหลด
  document.body.appendChild(link); // เพิ่มลิงก์ลงใน DOM
  link.click(); // คลิกเพื่อดาวน์โหลด
  document.body.removeChild(link); // ลบลิงก์ออกจาก DOM
};

const previewWord = async (file) => {
  try {
    const response = await fetch(file.path);
    const arrayBuffer = await response.arrayBuffer();

    // ใช้ Mammoth.js แปลงไฟล์ Word เป็น HTML
    const result = await mammoth.convertToHtml({ arrayBuffer });
    previewContent.value = result.value; // HTML Content
    previewFileType.value = "word";
    isPreviewModalOpen.value = true;
  } catch (error) {
    console.error("Error previewing Word file:", error);
    alert("ไม่สามารถพรีวิวไฟล์ Word ได้");
  }
};

const previewPDF = (file) => {
  previewFile.value = file;
  previewFileType.value = "pdf";
  isPreviewModalOpen.value = true;
};

// ฟังก์ชันอ่านไฟล์ Excel และแสดงข้อมูล
const previewExcelContent = async (file) => {
  try {
    // ดึงเนื้อหาไฟล์
    const response = await fetch(file.path);
    const arrayBuffer = await response.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0]; // เลือก Sheet แรก
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // แปลงเป็น JSON

    previewContent.value = jsonData;
    previewFileType.value = "excel";
    isPreviewModalOpen.value = true;
  } catch (error) {
    console.error("Error previewing Excel file:", error);
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

const closePreviewModal = () => {
  previewFile.value = null;
  isPreviewModalOpen.value = false;
};

onMounted(async () => {
  await fetchCURU();
  previewFileType.value = null;
  console.log("CURU Data:", CURU.value);
});
</script>

<style scoped>
/* General Styles */
input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

button {
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

/* ปุ่มดาวน์โหลด */
.download-btn {
  background-color: #28a745; /* สีเขียว */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.download-btn:hover {
  background-color: #218838; /* สีเขียวเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.download-btn:active {
  transform: scale(0.97);
}

/* ปุ่มลบ */
.delete-btn {
  background-color: #e11d48; /* สีแดง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #be123c; /* สีแดงเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn:active {
  transform: scale(0.97);
}

/* ตาราง */
.table-auto {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
}

.table-auto th,
.table-auto td {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.table-auto th {
  background-color: #007bff; /* สีหัวตาราง */
  color: white;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-auto td {
  background-color: #ffffff;
  font-size: 14px;
  color: #4b5563;
  vertical-align: middle;
  transition: background-color 0.3s;
}

.table-auto tr:nth-child(even) td {
  background-color: #f9fafb;
}

.table-auto tr:hover td {
  background-color: #e3f2fd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 12px; /* ความกว้างของ Scrollbar */
  background-color: #f5f5f5; /* สีพื้นหลังของ Scrollbar */
  border-radius: 6px; /* มุมโค้ง */
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #007bff; /* สีของ Scrollbar */
  border-radius: 6px; /* มุมโค้ง */
  border: 3px solid #f5f5f5; /* ระยะห่างของ Scrollbar */
  transition: background-color 0.3s, border-color 0.3s; /* เพิ่มเอฟเฟกต์ */
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #0056b3; /* สีเข้มขึ้นเมื่อ Hover */
  border-color: #e0e7ff; /* เปลี่ยนสีขอบเมื่อ Hover */
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #e9ecef; /* สีพื้นหลังของ Track */
  border-radius: 6px; /* มุมโค้งของ Track */
  margin: 4px; /* ระยะห่างระหว่าง Track */
}

/* ปุ่ม Preview */
.preview-btn {
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.preview-btn:hover {
  background-color: #4338ca;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-btn:active {
  transform: scale(0.97);
}

.preview-btn svg {
  fill: white;
  margin-right: 8px;
}

.preview-btn span {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  input {
    font-size: 14px;
    padding: 10px;
  }

  .download-btn,
  .delete-btn,
  .preview-btn {
    font-size: 12px;
    padding: 10px 16px;
  }

  .table-auto th,
  .table-auto td {
    font-size: 12px;
    padding: 10px;
  }
}
</style>
//CURU//
