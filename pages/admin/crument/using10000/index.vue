<template>
  <adminLayouts>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- ส่วนหัว -->
      <div class="bg-blue-600 text-white rounded-lg px-6 py-4 shadow-lg mb-6">
        <h1 class="text-3xl font-bold text-center">
          ระบบจัดการเครื่องมือราคาต่ำกว่า 10,000 บาท
        </h1>
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
          <form
            @submit.prevent="handleUpload10000"
            class="flex-1 flex items-center gap-4"
          >
            <input
              type="file"
              @change="handleFileUpload10000"
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
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">
          รายการเครื่องมือราคาต่ำกว่า 10,000 บาท
        </h2>
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
                v-for="file in filteredUsing10000"
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

                  <!-- ปุ่มลบไฟล์ -->
                  <button
                    @click="delete10000(file.id)"
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
              <tr v-if="filteredUsing10000.length === 0">
                <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref("");
const selected10000 = ref(null);
const using10000 = ref([]);

const filteredUsing10000 = computed(() => {
  if (!searchQuery.value) {
    return using10000.value;
  }
  return using10000.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetch10000 = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/crument/using10000/10000");
    if (error.value) {
      console.error("Error fetching using10000 files:", error.value);
    } else {
      using10000.value = data.value;
    }
  } catch (error) {
    console.error("Error fetching using10000 files:", error);
  }
};

const handleFileUpload10000 = (event) => {
  selected10000.value = event.target.files[0];
};

const handleUpload10000 = async () => {
  if (!selected10000.value) {
    alert("Please select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selected10000.value);

  try {
    const response = await fetch("/api/admin/crument/using10000/10000", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    alert("Upload Successful");
    fetch10000();
  } catch (error) {
    console.error(error);
  }
};

const delete10000 = async (id) => {
  if (confirm("คุณแน่ใจว่าจะลบไฟล์นี้?")) {
    try {
      const response = await fetch("/api/admin/crument/using10000/delete", {
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
      fetch10000();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  }
};

onMounted(fetch10000);
</script>
<style scoped>
/* General Input Styles */
input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px #007bff;
}

/* Button General Styles */
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
  font-weight: 600;
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
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #be123c; /* สีแดงเข้ม */
}

.delete-btn:active {
  transform: scale(0.98);
}

/* Table Styles */
.table-auto {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-auto th,
.table-auto td {
  padding: 12px 16px;
  text-align: center;
  border: 1px solid #d1d5db;
}

.table-auto th {
  background-color: #007bff; /* สีฟ้าหัวตาราง */
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-auto td {
  background-color: #ffffff; /* สีพื้นหลังของเซลล์ */
  font-size: 14px;
  color: #4b5563;
  text-align: center;
  vertical-align: middle;
}

.table-auto tr:nth-child(even) td {
  background-color: #f3f4f6; /* สีเทาสำหรับแถวคู่ */
}

.table-auto tr:hover td {
  background-color: #e0f2fe; /* สีพื้นหลังเมื่อ hover */
}

/* Scrollbar Styles */
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

/* Typography Enhancements */
h1,
h2 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h1 {
  color: #ffffff;
}

h2 {
  color: #007bff;
  margin-bottom: 20px;
}

/* Container Enhancements */
.container {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
