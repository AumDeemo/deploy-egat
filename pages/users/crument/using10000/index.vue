<template>
  <usersLayouts>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- ส่วนหัว -->
      <div class="bg-blue-600 text-white rounded-lg px-6 py-4 shadow-lg mb-6">
        <h1 class="text-3xl font-bold text-center">
          เครื่องมือเครื่องใช้ราคาต่ำกว่า 10,000 บาท
        </h1>
        <p class="text-center text-sm mt-2">การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)</p>
      </div>

      <!-- ช่องค้นหา -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- ตาราง -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">
          รายการเครื่องมือเครื่องใช้
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
  v-for="file in filteredFiles"
  :key="file.id"
  class="hover:bg-gray-50 transition duration-200"
>
                <td class="p-4 text-gray-800 border-b border-gray-300">
                  {{ file.name }}
                </td>
                <td class="p-4 text-center">
                  <!-- ปุ่มสำหรับดาวน์โหลดไฟล์ -->
                  <a
                    :href="file.path"
                    :download="file.name"
                    class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                  >
                    ดาวน์โหลด
                  </a>
                </td>
              </tr>
              <tr v-if="using10000.length === 0">
                <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </usersLayouts>
</template>

<script setup>
import { ref, onMounted } from "vue";
import usersLayouts from "~/layouts/userLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selected10000 = ref(null);
const using10000 = ref([]);

// ฟังก์ชันสำหรับกรองข้อมูลตามคำค้นหา
const filteredFiles = computed(() => {
  return using10000.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// ดึงข้อมูล PR จาก API
const fetch10000 = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/crument/using10000/10000");

    if (error.value) {
      console.error("Error fetching using10000 files:", error.value);
    } else {
      using10000.value = data.value; // เก็บข้อมูลที่ได้
    }
  } catch (error) {
    console.error("Error fetching 10000 files:", error);
  }
};

const handleFileUpload10000 = (event) => {
  selected10000.value = event.target.files[0];
};

const handleUpload10000 = async () => {
  if (!selected10000.value) {
    alert("กรุณาเลือกไฟล์");
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

    alert("อัปโหลดไฟล์สำเร็จ");
    fetch10000(); // รีเฟรชข้อมูลหลังอัปโหลด
  } catch (error) {
    console.error(error);
  }
};

// ลบไฟล์
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
      fetch10000(); // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  }
};

onMounted(fetch10000);
</script>

<style scoped>
/* สไตล์ตาราง */
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

.overflow-x-auto {
  overflow-x: auto;
}
</style>
