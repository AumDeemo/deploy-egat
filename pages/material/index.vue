<template>
  <div class="flex items-center justify-center mt-10 font-prompt">
    <form @submit.prevent="material" class="card w-full max-w-sm bg-yellow-300 shadow-md">
      <div class="card-body">
        <div class="flex justify-center">
          <div class="flex">
            <img
              src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png"
              alt="logo"
              class="w-16"
            />
            <div class="flex items-end">
              <p class="text-2xl font-semibold inline-block select-none">บันทึกรายการ</p>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div>
          <div class="form-control select-none">
            <label>ชื่ออะไหล่</label>
            <input
              v-model="name"
              type="text"
              placeholder=""
              class="input input-bordered"
            />
          </div>
          <div class="form-control mt-5 select-none">
            <label>Part number</label>
            <input
              v-model="partnumber"
              type="text"
              placeholder=""
              class="input input-bordered"
            />
          </div>
          <div class="form-control mt-5 select-none">
            <label>จำนวน</label>
            <input
              v-model="totalAmount"
              type="number"
              placeholder=""
              class="input input-bordered"
            />
          </div>
          <!-- ฟอร์มเปิด-ปิด หมวดหมู่ -->
          <div class="form-control mt-5 select-none relative">
            <label
              @click="toggleCategory"
              class="cursor-pointer flex items-center justify-between bg-blue-500 text-white p-3 border border-blue-600 rounded-md shadow-md hover:bg-blue-600"
            >
              <span class="font-semibold">หมวดหมู่</span>
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
              class="absolute bg-white p-4 rounded-lg border border-gray-300 shadow-xl mt-2 w-full z-50 max-h-60 overflow-y-auto"
              style="top: calc(100% + 0.5rem)"
            >
              <ul class="space-y-2">
                <li
                  v-for="cat in categories"
                  :key="cat"
                  class="flex items-center gap-3 py-2 px-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <input
                    type="checkbox"
                    :id="cat"
                    :value="cat"
                    v-model="category"
                    class="cursor-pointer accent-blue-500"
                  />
                  <label
                    :for="cat"
                    class="flex items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-blue-500"
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
                    {{ cat }}
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div class="form-control mt-5 select-none">
            <label>อัปโหลดรูปภาพ</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="file-input file-input-bordered"
            />
            <div class="mt-4 flex justify-center items-center">
              <div
                class="preview-container w-32 h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-md hover:border-blue-400"
              >
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="Selected Image"
                  class="w-full h-full object-cover rounded-md"
                />
                <p v-else class="text-sm text-gray-400 text-center">Select Image</p>
              </div>
            </div>
          </div>
          <div class="form-control mt-5">
            <button type="submit" class="btn btn-accent text-white font-light">
              ยืนยัน
            </button>
          </div>
        </div>

        <RouterLink to="/admin/sparepartslist" class="flex justify-center">
          <div class="flex justify-center bg-black p-2 rounded-xl">
            <p class="text-white text-sm select-none">กลับหน้าแรก</p>
          </div>
        </RouterLink>
      </div>
    </form>
    <!-- หน้าต่างแจ้งเตือนลอย -->
    <div
      v-if="isToastVisible"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const name = ref("");
const partnumber = ref("");
const totalAmount = ref("");
const imageFile = ref(null);
const successMessage = ref("");
const previewImage = ref(null);
const category = ref([]);
const categories = ref([]); // ตัวแปรสำหรับเก็บรายการหมวดหมู่
const isCategoryOpen = ref(false); // สำหรับควบคุมเปิด-ปิดฟอร์มหมวดหมู่
const isToastVisible = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  imageFile.value = file;
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

// ฟังก์ชันบันทึกข้อมูล
const material = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("partnumber", partnumber.value);
    formData.append("totalAmount", totalAmount.value);

    // แปลงค่าหมวดหมู่เป็นสตริงที่คั่นด้วยคอมม่า
    formData.append("category", category.value.join(","));

    formData.append("image", imageFile.value);

    const response = await fetch("/api/admin/new/material", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      successMessage.value = result.message;
      name.value = "";
      partnumber.value = "";
      totalAmount.value = "";
      category.value = [];
      imageFile.value = null;
      previewImage.value = null;
      // แสดงแจ้งเตือนลอย
      isToastVisible.value = true;
      // รีเซ็ต input file
      const fileInput = document.querySelector("input[type='file']");
      if (fileInput) fileInput.value = "";

      // ตั้งเวลาให้แจ้งเตือนหายหลัง 2 วินาที
      setTimeout(() => {
        isToastVisible.value = false;
      }, 2000);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};

// ดึงรายการหมวดหมู่จาก API
onMounted(async () => {
  try {
    const response = await fetch("/api/admin/new/category");
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data; // เก็บรายการหมวดหมู่ในตัวแปร
    } else {
      console.error("Error fetching categories:", result.message);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});
// ฟังก์ชันเปิด-ปิดฟอร์มหมวดหมู่
const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};
</script>
<style scoped>
.font-prompt {
  font-family: "Prompt", sans-serif !important;
}
.alert {
  padding: 1rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  color: #155724;
  text-align: center;
}
.preview-container {
  position: relative;
  background-color: #f9fafb; /* สีพื้นหลัง */
  transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  display: flex; /* ใช้ flexbox */
  justify-content: center; /* จัดให้อยู่กึ่งกลางแนวนอน */
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
}

.preview-container:hover {
  background-color: #eef6ff; /* สีพื้นหลังเมื่อ hover */
  border-color: #007bff; /* สีขอบเมื่อ hover */
}

.preview-container img {
  border-radius: 8px; /* มุมมนสำหรับรูปภาพ */
}

.file-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  font-size: 0.875rem; /* ขนาดตัวอักษร */
  color: #555;
  background-color: #f9fafb; /* สีพื้นหลัง */
  transition: border-color 0.3s ease-in-out;
}

.file-input:hover {
  border-color: #007bff; /* สีขอบเมื่อ hover */
}

.file-input:focus {
  border-color: #0056b3; /* สีขอบเมื่อ focus */
  outline: none;
}
.select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  font-size: 0.875rem;
  color: #555;
  background-color: #f9fafb;
  transition: border-color 0.3s ease-in-out;
}

.select:hover {
  border-color: #007bff;
}

.select:focus {
  border-color: #0056b3;
  outline: none;
}
/* เพิ่มการตกแต่งฟอร์มหมวดหมู่ */
.form-control .cursor-pointer {
  font-family: "Prompt", sans-serif;
}

.form-control .cursor-pointer span {
  font-size: 1rem;
}

.form-control input[type="checkbox"] {
  transform: scale(1.2);
  transition: all 0.2s ease-in-out;
}

.form-control input[type="checkbox"]:hover {
  transform: scale(1.3);
}

.form-control .hover\:bg-gray-100:hover {
  background-color: #f3f4f6; /* สีพื้นหลังเมื่อ hover */
}

.form-control .accent-blue-500:checked {
  background-color: #2563eb; /* เปลี่ยนสีเมื่อถูกเลือก */
  border-color: #2563eb;
}

.form-control .rounded-md {
  border-radius: 8px;
}
/* เมนูย่อย */
.bg-blue-50 {
  background-color: #ebf8ff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.hover\:bg-blue-50:hover {
  background-color: #ebf8ff;
}

.rounded-lg {
  border-radius: 0.75rem;
}

.transition {
  transition: all 0.3s ease-in-out;
}

.max-h-60 {
  max-height: 15rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Checkbox ปรับขนาด */
input[type="checkbox"] {
  transform: scale(1.2);
  transition: all 0.2s ease-in-out;
}

input[type="checkbox"]:hover {
  transform: scale(1.3);
}

/* เพิ่มไอคอน */
svg {
  flex-shrink: 0;
}
</style>
//material//
