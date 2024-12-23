<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedFilePR = ref(null);
const selectedFilePO = ref(null);
const prFiles = ref([]); // ใช้เก็บข้อมูล PR
const poFiles = ref([]); // ใช้เก็บข้อมูล PO

// ฟังก์ชันสำหรับกรองไฟล์ PR และ PO ตาม searchQuery
const filteredPRFiles = computed(() => {
  if (!searchQuery.value) return prFiles.value;
  return prFiles.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredPOFiles = computed(() => {
  if (!searchQuery.value) return poFiles.value;
  return poFiles.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

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

// ลบไฟล์ PR
const deletePRFile = async (id) => {
  if (confirm("คุณแน่ใจว่าจะลบไฟล์นี้?")) {
    try {
      const response = await fetch("/api/admin/pr/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const data = await response.json();
      alert("ไฟล์ถูกลบสำเร็จ");
      fetchPRFiles(); // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  }
};

// ลบไฟล์ PO
const deletePOFile = async (id) => {
  if (confirm("คุณแน่ใจว่าจะลบไฟล์นี้?")) {
    try {
      const response = await fetch("/api/admin/po/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const data = await response.json();
      alert("ไฟล์ถูกลบสำเร็จ");
      fetchPRFiles(); // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
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
    <div class="max-w-8xl mx-auto px-4 py-6 bg-gray-100 min-h-screen overflow-auto">
      <!-- Header Section -->
      <div class="flex flex-col gap-6 mb-6">
        <!-- ช่องค้นหา -->
        <div class="flex justify-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาไฟล์..."
            class="w-full p-3 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <!-- ส่วน Upload PR และ PO -->
        <div class="flex flex-col sm:flex-row justify-between gap-4">
          <!-- PR File Upload -->
          <form
            @submit.prevent="handleUploadPR"
            class="flex flex-col sm:flex-row items-center gap-2 w-full"
          >
            <input
              type="file"
              @change="handleFileUploadPR"
              accept=".xls,.xlsx"
              class="file-input w-full sm:w-3/4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              อัปโหลด PR
            </button>
          </form>

          <!-- PO File Upload -->
          <form
            @submit.prevent="handleUploadPO"
            class="flex flex-col sm:flex-row items-center gap-2 w-full"
          >
            <input
              type="file"
              @change="handleFileUploadPO"
              accept=".xls,.xlsx"
              class="file-input w-full sm:w-3/4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              class="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              อัปโหลด PO
            </button>
          </form>
        </div>
      </div>

      <!-- Tables Section -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- PR Table -->
        <div class="w-full lg:w-1/2 bg-white rounded-lg shadow-lg">
          <div class="bg-blue-600 text-white text-center py-3 text-2xl font-bold">
            ไฟล์ PR
          </div>
          <div class="overflow-y-auto max-h-[400px] custom-scrollbar">
            <table class="w-full table-auto">
              <thead class="bg-gray-200">
                <tr>
                  <th class="p-4 text-center font-semibold">ชื่อไฟล์</th>
                  <th class="p-4 text-center font-semibold">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPRFiles"
                  :key="file.id"
                  class="hover:bg-gray-100 transition duration-200"
                >
                  <td class="p-4 truncate text-center">{{ file.name }}</td>
                  <td class="p-4 flex justify-center items-center gap-2">
                    <a
                      :href="file.path"
                      target="_blank"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                      เปิดไฟล์
                    </a>
                    <button
                      @click="deletePRFile(file.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPRFiles.length === 0">
                  <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์ PR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PO Table -->
        <div class="w-full lg:w-1/2 bg-white rounded-lg shadow-lg">
          <div class="bg-yellow-500 text-white text-center py-3 text-2xl font-bold">
            ไฟล์ PO
          </div>
          <div class="overflow-y-auto max-h-[400px] custom-scrollbar">
            <table class="w-full table-auto">
              <thead class="bg-gray-200">
                <tr>
                  <th class="p-4 text-center font-semibold">ชื่อไฟล์</th>
                  <th class="p-4 text-center font-semibold">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPOFiles"
                  :key="file.id"
                  class="hover:bg-gray-100 transition duration-200"
                >
                  <td class="p-4 truncate text-center">{{ file.name }}</td>
                  <td class="p-4 flex justify-center items-center gap-2">
                    <a
                      :href="file.path"
                      target="_blank"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                      เปิดไฟล์
                    </a>
                    <button
                      @click="deletePOFile(file.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPOFiles.length === 0">
                  <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์ PO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #d1d5db #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
  border: 2px solid #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1aa;
}
/* Input File Style */
.file-input {
  display: block;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.file-input::file-selector-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.file-input::file-selector-button:hover {
  background-color: #0056b3;
}

table th,
table td {
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

table th {
  background-color: #f3f4f6;
  font-weight: 600;
}

table tr:hover {
  background-color: #f9fafb;
}
</style>
