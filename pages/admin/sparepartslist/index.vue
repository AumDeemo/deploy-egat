<script setup>
import { ref, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const materials = ref([]);
const selectedMaterial = ref(null);
const modalType = ref(null);
const quantity = ref("");
const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedImage = ref(null);
const selectedCategory = ref([]); // เก็บหมวดหมู่ที่เลือก
const categories = ref([]); // เก็บหมวดหมู่ทั้งหมด
const isCategoryOpen = ref(false); // สถานะเปิด-ปิด dropdown หมวดหมู่
const categoryDropdownRef = ref(null); // สำหรับอ้างอิง dropdown หมวดหมู่

// ฟังก์ชันเปิด/ปิดหมวดหมู่
const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};

// ฟังก์ชันปิด dropdown เมื่อคลิกนอกพื้นที่
const handleClickOutsideCategory = (event) => {
  if (
    categoryDropdownRef.value && // ตรวจสอบว่า dropdown ถูก mount แล้ว
    !categoryDropdownRef.value.contains(event.target) // ตรวจสอบว่าคลิกนอกพื้นที่ dropdown
  ) {
    isCategoryOpen.value = false; // ปิด dropdown
  }
};
// เพิ่ม Event Listener เมื่อคอมโพเนนต์ถูก mounted
onMounted(() => {
  window.addEventListener("click", handleClickOutsideCategory);
});

// ลบ Event Listener เมื่อคอมโพเนนต์ถูก unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideCategory);
});
// Modal types
const MODAL_TYPES = {
  IMPORT: "import",
  EXPORT: "export",
  DETAILS: "details",
  EDIT: "edit",
  DELETE: "delete",
};

const fetchCategories = async () => {
  try {
    const response = await fetch("/api/admin/new/category");
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data;
    } else {
      console.error("Error fetching categories:", result.message);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    selectedImage.value = null;
    return;
  }

  // ตรวจสอบประเภทและขนาดของไฟล์
  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
    return;
  }

  selectedImage.value = file;
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

// กรองวัสดุตามหมวดหมู่และคำค้นหา
const filteredMaterials = computed(() => {
  let filtered = materials.value;

  if (selectedCategory.value.length > 0) {
    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || [];
      return selectedCategory.value.some((cat) => materialCategories.includes(cat));
    });
  }

  // กรองตามคำค้นหาหลายคำที่พิมพ์ (ค้นหาจากชื่อวัสดุและหมวดหมู่)
  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" ");
    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || [];
      return searchTerms.every((term) => {
        return (
          material.name?.toLowerCase().includes(term) ||
          materialCategories.some((cat) => cat.toLowerCase().includes(term)) ||
          material.partnumber?.toLowerCase().includes(term)
        );
      });
    });
  }

  return filtered;
});

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

  const formData = new FormData();
  formData.append("id", selectedMaterial.value.id);
  formData.append("name", selectedMaterial.value.name);
  formData.append("partnumber", selectedMaterial.value.partnumber);
  if (selectedImage.value) {
    formData.append("image", selectedImage.value);
  }

  try {
    const response = await fetch("/api/admin/material", {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) throw new Error("แก้ไขข้อมูลไม่สำเร็จ");

    await fetchMaterials();
    closeModal();
    alert("แก้ไขข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
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
    alert("ลบข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
  } catch (err) {
    // Show error notification
    useToast().error("ไม่สามารถลบวัสดุได้");
    console.error("Error deleting material:", err);
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchMaterials();
});
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto">
      <!-- ปุ่มเพิ่มรายการ และ ช่องค้นหา แนวนอน -->
      <div class="flex justify-between items-center mb-4 gap-4">
        <!-- ปุ่มเพิ่มรายการ -->
        <RouterLink
          to="/material"
          class="bg-green-500 rounded-lg w-full py-3 cursor-pointer transform transition duration-200 ease-in-out shadow-md hover:shadow-lg hover:bg-green-600 active:scale-95 active:bg-green-700 flex items-center justify-center"
        >
          <div class="flex gap-2 items-center">
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
            <p class="text-white font-bold text-lg">เพิ่มรายการ</p>
          </div>
        </RouterLink>

        <!-- ช่องค้นหา -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา"
          class="w-1/3 p-3 border border-gray-300 rounded-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
        />
      </div>
      <!-- หมวดหมู่ -->
      <div class="form-control mt-5 select-none relative" ref="categoryDropdownRef">
        <label
          @click="toggleCategory"
          class="cursor-pointer flex items-center justify-center bg-blue-700 text-white p-3 border border-blue-800 rounded-lg shadow-lg hover:bg-blue-800 transition duration-300"
        >
          <span class="font-semibold text-lg">หมวดหมู่</span>
          <span
            class="ml-2 transition-transform duration-300"
            :class="{ 'rotate-180': isCategoryOpen }"
          >
            ▼
          </span>
        </label>

        <!-- เมนูย่อย -->
        <div
          v-if="isCategoryOpen"
          class="menu-dropdown absolute bg-white p-5 rounded-lg border border-gray-300 shadow-2xl mt-2 z-50 max-h-72 overflow-y-auto w-full"
          style="top: calc(100% + 0.5rem)"
        >
          <ul class="space-y-3">
            <li
              v-for="cat in categories"
              :key="cat"
              class="flex items-center gap-4 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg shadow-sm transition duration-200 cursor-pointer"
              @click="toggleCategorySelection(cat)"
            >
              <input
                type="checkbox"
                :id="cat"
                :value="cat"
                v-model="selectedCategory"
                class="cursor-pointer accent-blue-700 w-5 h-5"
                @click.stop
              />
              <label
                :for="cat"
                class="flex items-center gap-3 text-gray-700 text-base cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
                <span>{{ cat }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <!-- Materials Table -->
      <div class="mt-5 justify-center w-full h-[680px] overflow-x-auto">
        <div class="bg-slate-300 p-4 rounded-xl">
          <div class="overflow-x-auto">
            <table class="table w-full table-fixed">
              <thead>
                <tr>
                  <th class="w-[50px]">ลำดับ</th>
                  <th class="w-[150px]">รูปภาพ</th>
                  <th class="w-[200px]">รายการ</th>
                  <th class="w-[200px]">PART NUMBER</th>
                  <th class="w-[100px]">คงเหลือ</th>
                  <th class="w-[150px]">นำเข้า</th>
                  <th class="w-[150px]">นำออก</th>
                  <th class="w-[200px]">รายละเอียดการเบิก</th>
                  <th class="w-[150px]">แก้ไข</th>
                  <th class="w-[150px]">ลบรายการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(material, index) in filteredMaterials" :key="material.id">
                  <th data-label="ลำดับ">{{ index + 1 }}</th>
                  <td data-label="รูปภาพ">
                    <!-- แสดงรูปภาพถ้ามี URL -->
                    <img
                      v-if="material.imageUrl"
                      :src="material.imageUrl"
                      alt="Material Image"
                      class="h-16 w-16 object-cover rounded-md"
                    />
                    <!-- แสดงข้อความถ้าไม่มีรูป -->
                    <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                  </td>
                  <td data-label="รายการ">{{ material.name }}</td>
                  <td data-label="PART NUMBER">{{ material.partnumber }}</td>
                  <td data-label="คงเหลือ">{{ material.totalAmount }}</td>
                  <td data-label="นำเข้า">
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

                  <td data-label="นำออก">
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

                  <td data-label="รายละเอียดการเบิก">
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

                  <td data-label="แก้ไข">
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

                  <td data-label="ลบรายการ">
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
                <tr v-if="filteredMaterials.length === 0">
                  <td colspan="9" class="text-center text-gray-500 py-4">
                    ไม่พบข้อมูลที่ตรงกับคำค้นหา
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
            <!-- ชื่อรายการ -->
            <input
              v-model="selectedMaterial.name"
              placeholder="ชื่อรายการ"
              class="w-full p-2 border rounded"
            />

            <!-- PART NUMBER -->
            <input
              v-model="selectedMaterial.partnumber"
              placeholder="Part Number"
              class="w-full p-2 border rounded"
            />

            <!-- รูปภาพปัจจุบัน -->
            <div>
              <p class="font-bold">รูปภาพปัจจุบัน:</p>
              <img
                v-if="selectedMaterial.imageUrl"
                :src="selectedMaterial.imageUrl"
                alt="Current Image"
                class="h-32 w-32 object-cover rounded-md mx-auto"
              />
              <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
            </div>

            <!-- เลือกรูปภาพใหม่ -->
            <div>
              <p class="font-bold">เลือกรูปภาพใหม่:</p>
              <input
                type="file"
                @change="handleImageChange"
                class="w-full p-2 border rounded"
                accept="image/*"
              />
              <p class="text-sm text-gray-500">
                ขนาดไฟล์ต้องไม่เกิน 5MB และรองรับเฉพาะไฟล์รูปภาพ
              </p>
            </div>
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
.table-container {
  width: 100%;
  overflow-x: auto; /* ป้องกันการซ่อนตารางหากเนื้อหาเกินขอบจอ */
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
}

.table th,
.table td {
  background-color: #ffffff;
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center; /* จัดข้อความในเซลล์ตรงกลาง */
}

.table th {
  background-color: #ffcc66;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
}

.table td:nth-child(2) {
  text-align: space-between; /* จัดให้อยู่ตรงกลางตามแนวนอน */
  vertical-align: middle; /* จัดให้อยู่ตรงกลางตามแนวตั้ง */
  padding: 8px;
}

.table td:nth-child(2) img {
  display: block; /* ให้ภาพเป็น block เพื่อให้จัดกึ่งกลางได้ */
  margin: 0 auto; /* จัดให้อยู่ตรงกลาง */
  max-width: 100px; /* กำหนดขนาดสูงสุดของภาพ */
  max-height: 100px;
}

/* จัดปุ่มให้อยู่กึ่งกลาง และกำหนดขนาดคงที่ */
.table td div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto; /* ความกว้างคงที่ */
}

.table td div > div {
  width: 120px; /* ความกว้างคงที่ */
  min-width: 120px; /* ป้องกันการหด */
  max-width: 120px; /* ป้องกันการขยาย */
  height: 40px; /* ความสูงคงที่ */
  flex: 0 0 auto; /* ป้องกันการยืด/หด */
  border-radius: 5px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #fefefe;
}
/* Responsive Table for screens smaller than 768px */
@media (max-width: 768px) {
  .table,
  .table thead,
  .table tbody,
  .table th,
  .table td,
  .table tr {
    display: block;
    width: 100%;
  }

  .table thead {
    display: none; /* ซ่อนหัวตาราง */
  }

  .table tr {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    background-color: #fefefe;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .table td {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #333;
    text-align: left;
  }

  .table td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #555;
    text-transform: capitalize;
    flex-basis: 40%;
  }

  .table td div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px; /* ความกว้างสำหรับจอปกติ */
  }
}

/* จอขนาดเล็กกว่า 480px */
@media (max-width: 480px) {
  .table td {
    font-size: 12px;
    padding: 8px;
  }

  .table td::before {
    font-size: 12px;
    flex-basis: 50%;
  }

  .table td div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px; /* ความกว้างสำหรับจอปกติ */
  }
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
.form-control .absolute {
  background: linear-gradient(90deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.form-control label {
  font-family: "Prompt", sans-serif;
}

.form-control .absolute ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.form-control .absolute ul li {
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
}

.form-control .absolute ul li:hover {
  background-color: #e0f2fe;
}

.form-control .absolute ul li svg {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.form-control .absolute ul li:hover svg {
  transform: scale(1.2);
}
/* Scrollbar Styling */
.menu-dropdown {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #007bff #f1f1f1; /* สีของ scrollbar และพื้นหลัง */
}

.menu-dropdown::-webkit-scrollbar {
  width: 8px; /* ความกว้างของ scrollbar */
}

.menu-dropdown::-webkit-scrollbar-thumb {
  background: #007bff; /* สีของ scrollbar */
  border-radius: 4px; /* มุมโค้งมนของ scrollbar */
}

.menu-dropdown::-webkit-scrollbar-thumb:hover {
  background: #0056b3; /* สีเมื่อ hover บน scrollbar */
}

.menu-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1; /* สีพื้นหลังของ scrollbar */
  border-radius: 4px; /* มุมโค้งมนของ track */
}

/* เพิ่มเอฟเฟกต์แบบ smooth */
.menu-dropdown {
  scroll-behavior: smooth;
}
</style>
//sparepartslist admin// V3
