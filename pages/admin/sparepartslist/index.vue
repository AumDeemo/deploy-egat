<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const materials = ref([]);
const selectedMaterial = ref(null);
const modalType = ref(null);
const quantity = ref("");

// Modal types
const MODAL_TYPES = {
  IMPORT: "import",
  EXPORT: "export",
  DETAILS: "details",
  EDIT: "edit",
  DELETE: "delete",
};

const materialHistory = ref({
  importHistory: [],
  exportHistory: [],
});

const fetchMaterialHistory = async (materialId) => {
  try {
    const response = await fetch(`/api/admin/material-history?materialId=${materialId}`);
    if (!response.ok) throw new Error("ดึงประวัติไม่สำเร็จ");

    materialHistory.value = await response.json();
  } catch (err) {
    console.error("Error fetching material history:", err);
  }
};

const fetchMaterials = async () => {
  try {
    const response = await fetch("/api/admin/material", {
      method: "GET",
    });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    materials.value = await response.json();
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
  }
};

const openModal = (type, material) => {
  modalType.value = type;
  selectedMaterial.value = material;
  quantity.value = "";

  if (type === MODAL_TYPES.DETAILS) {
    fetchMaterialHistory(material.id);
  }
};

const closeModal = () => {
  modalType.value = null;
  selectedMaterial.value = null;
  quantity.value = "";
};

watch(quantity, (newValue) => {
  console.log("quantity:", newValue);
});

watch(selectedMaterial, (newValue) => {
  console.log("selectedMaterial.value.id :", newValue);
});

const handleMaterialAction = async () => {
  if (!selectedMaterial.value || !quantity.value) return;

  try {
    const actionType = modalType.value === MODAL_TYPES.IMPORT ? "import" : "export";
    const response = await fetch("/api/admin/material-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        materialId: selectedMaterial.value.id,
        quantity: Number(quantity.value),
        type: actionType,
      }),
    });

    if (!response.ok) throw new Error(`การ${actionType}ไม่สำเร็จ`);

    await fetchMaterials();
    closeModal();
  } catch (err) {
    console.error(`Error in ${actionType}:`, err);
    // TODO: Add proper error handling (e.g., toast notification)
  }
};

const handleEditMaterial = async () => {
  if (!selectedMaterial.value) return;

  try {
    const response = await fetch("/api/admin/material", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedMaterial.value.id,
        ...selectedMaterial.value,
      }),
    });

    if (!response.ok) throw new Error("แก้ไขข้อมูลไม่สำเร็จ");

    await fetchMaterials();
    closeModal();
  } catch (err) {
    console.error("Error editing material:", err);
    // TODO: Add proper error handling
  }
};

const handleDeleteMaterial = async () => {
  if (!selectedMaterial.value) return;
  try {
    const response = await $fetch(`/api/material/${selectedMaterial.value.id}`, {
      method: "DELETE",
    });
    console.log("resDel : ", response);
    // Refresh materials list
    await fetchMaterials();
    closeModal();
  } catch (err) {
    // Show error notification
    useToast().error("ไม่สามารถลบวัสดุได้");
    console.error("Error deleting material:", err);
  }
};

onMounted(async () => {
  await fetchMaterials();
});
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto">
      <!-- Add Material Button -->
      <div class="flex justify-center">
        <RouterLink
          to="/material"
          class="bg-green-500 w-screen rounded-lg p-3 cursor-pointer transform transition duration-200 ease-in-out shadow-md hover:shadow-lg hover:bg-green-600 active:scale-95 active:bg-green-700"
        >
          <div class="flex gap-2 justify-center items-center">
            <div class="transform transition duration-200 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <p
              class="text-white font-bold text-lg transform transition duration-200 hover:scale-105"
            >
              เพิ่มรายการ
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Materials Table -->
      <div class="mt-5 justify-center w-full h-[680px] overflow-x-auto">
        <div class="bg-slate-300 p-4 rounded-xl">
          <div class="overflow-x-auto">
            <table class="table w-full table-fixed">
              <thead>
                <tr>
                  <th class="w-[50px]">ลำดับ</th>
                  <th class="w-[200px]">รายการ</th>
                  <th class="w-[200px]">PART NUMBER</th>
                  <th class="w-[200px]">คงเหลือ</th>
                  <th class="w-[150px]">นำเข้า</th>
                  <th class="w-[150px]">นำออก</th>
                  <th class="w-[200px]">รายละเอียดการเบิก</th>
                  <th class="w-[150px]">แก้ไข</th>
                  <th class="w-[150px]">ลบรายการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(material, index) in materials" :key="material.id">
                  <th>{{ index + 1 }}</th>
                  <!-- ใช้ index เพื่อแสดงลำดับ -->
                  <td>{{ material.name }}</td>
                  <td>{{ material.partnumber }}</td>
                  <td>{{ material.totalAmount }}</td>
                  <td>
                    <div
                      @click="openModal(MODAL_TYPES.IMPORT, material)"
                      class="bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="4"
                        stroke="#ffffff"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      <p class="text-white font-medium">นำเข้า</p>
                    </div>
                  </td>

                  <td>
                    <div
                      @click="openModal(MODAL_TYPES.EXPORT, material)"
                      class="bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="4"
                        stroke="#ffffff"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                      <p class="text-white font-medium">นำออก</p>
                    </div>
                  </td>

                  <td>
                    <div
                      @click="openModal(MODAL_TYPES.DETAILS, material)"
                      class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#000000"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                      <p class="text-white font-medium">ข้อมูล</p>
                    </div>
                  </td>

                  <td>
                    <div
                      @click="openModal(MODAL_TYPES.EDIT, material)"
                      class="bg-orange-400 hover:bg-orange-500 active:bg-orange-600 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#000000"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      <p class="text-white font-medium">แก้ไข</p>
                    </div>
                  </td>

                  <td>
                    <div
                      @click="openModal(MODAL_TYPES.DELETE, material)"
                      class="bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#000000"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                      <p class="text-white font-medium">ลบ</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Import/Export Modal -->
      <div
        v-if="modalType === MODAL_TYPES.IMPORT || modalType === MODAL_TYPES.EXPORT"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">
            {{ modalType === MODAL_TYPES.IMPORT ? "นำเข้า" : "นำออก" }}
            {{ selectedMaterial?.name }}
          </h2>
          <input
            v-model="quantity"
            type="number"
            placeholder="ระบุจำนวน"
            class="w-full p-2 border rounded mb-4"
          />
          <div class="flex justify-between">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button
              @click="handleMaterialAction"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DETAILS"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-auto">
          <h2 class="text-xl font-bold mb-4">รายละเอียด {{ selectedMaterial?.name }}</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">ข้อมูลทั่วไป</h3>
              <p><strong>Part Number:</strong> {{ selectedMaterial?.partnumber }}</p>
              <p><strong>จำนวนคงเหลือ:</strong> {{ selectedMaterial?.totalAmount }}</p>
            </div>

            <div>
              <div class="flex justify-center items-center">
                <h3 class="text-lg font-semibold mb-2">ประวัติการนำเข้า</h3>
              </div>
              <table v-if="materialHistory.importHistory.length" class="w-full border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2">วันที่</th>
                    <th class="border p-2">จำนวน</th>
                    <th class="border p-2">ผู้นำเข้า</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="history in materialHistory.importHistory"
                    :key="history.id"
                    class="text-center"
                  >
                    <td class="border p-2">
                      {{ new Date(history.date).toLocaleString() }}
                    </td>
                    <td class="border p-2">{{ history.quantity }}</td>
                    <td class="border p-2">{{ history.user || "-" }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="flex justify-center items-center">
                <p class="text-gray-500">ไม่มีประวัติการนำเข้า</p>
              </div>
            </div>

            <div>
              <div class="flex justify-center items-center">
                <h3 class="text-lg font-semibold mb-2">ประวัติการนำออก</h3>
              </div>
              <table v-if="materialHistory.exportHistory.length" class="w-full border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2">วันที่</th>
                    <th class="border p-2">จำนวน</th>
                    <th class="border p-2">ผู้นำออก</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="history in materialHistory.exportHistory"
                    :key="history.id"
                    class="text-center"
                  >
                    <td class="border p-2">
                      {{ new Date(history.date).toLocaleString() }}
                    </td>
                    <td class="border p-2">{{ history.quantity }}</td>
                    <td class="border p-2">{{ history.user || "-" }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="flex justify-center items-center">
                <p class="text-gray-500">ไม่มีประวัติการนำออก</p>
              </div>
            </div>
          </div>

          <div class="mt-4 text-right">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ปิด
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="modalType === MODAL_TYPES.EDIT"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">แก้ไข {{ selectedMaterial?.name }}</h2>
          <div class="space-y-4">
            <input
              v-model="selectedMaterial.name"
              placeholder="ชื่อรายการ"
              class="w-full p-2 border rounded"
            />
            <input
              v-model="selectedMaterial.partnumber"
              placeholder="Part Number"
              class="w-full p-2 border rounded"
            />
            <!-- Add more editable fields as needed -->
          </div>
          <div class="flex justify-between mt-4">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button
              @click="handleEditMaterial"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DELETE"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">
            ยืนยันการลบรายการ: {{ selectedMaterial?.name }}
          </h2>
          <p class="text-gray-600 mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
          <div class="flex justify-between">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button
              @click="handleDeleteMaterial"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              ลบรายการ
            </button>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse; /* ลบเส้นระหว่างขอบ */
  font-family: "Kanit", sans-serif; /* ใช้ฟอนต์ที่สวยงาม */
  font-size: 0.9rem;
}

.table th,
.table td {
  background-color: #ffffff;
  padding: 12px; /* เพิ่มช่องว่างในเซลล์ */
  border: 1px solid #ddd;
  text-align: center;
}

.table th {
  background-color: #ffcc66; /* สีพื้นหลังของหัวตาราง */
  color: #333; /* สีข้อความของหัวตาราง */
  font-weight: bold;
  text-transform: uppercase; /* ทำให้ข้อความเป็นตัวพิมพ์ใหญ่ */
  letter-spacing: 0.05em; /* เพิ่มช่องว่างระหว่างตัวอักษร */
}

.table td {
  color: #555; /* สีข้อความของเซลล์ */
}

.table tbody tr:nth-child(odd) {
  background-color: #f9f9f9; /* สีพื้นหลังของแถวคี่ */
}

.table tbody tr:nth-child(even) {
  background-color: #ffffff; /* สีพื้นหลังของแถวคู่ */
}

.table td:first-child {
  font-weight: bold; /* ทำให้ข้อความในเซลล์แรกของแต่ละแถวเป็นตัวหนา */
}

.table th:first-child {
  border-left: 2px solid #ff9900; /* เพิ่มเส้นขอบพิเศษ */
}

.table th:last-child {
  border-right: 2px solid #ff9900; /* เพิ่มเส้นขอบพิเศษ */
}
</style>
