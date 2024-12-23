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

        <!-- แสดงข้อความแจ้งเตือน -->
        <div v-if="successMessage" class="alert alert-success mb-5">
          <p>{{ successMessage }}</p>
        </div>

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
          <div class="form-control mt-5 select-none">
            <label>หมวดหมู่</label>
            <select v-model="category" class="select select-bordered">
              <option value="" disabled>เลือกหมวดหมู่</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
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
const category = ref("");
const categories = ref([]); // ตัวแปรสำหรับเก็บรายการหมวดหมู่

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  imageFile.value = file;
  if (file) {
    previewImage.value = URL.createObjectURL(file);
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

// ฟังก์ชันบันทึกข้อมูล
const material = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("partnumber", partnumber.value);
    formData.append("totalAmount", totalAmount.value);
    formData.append("category", category.value);
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
      category.value = "";
      imageFile.value = null;
      previewImage.value = null;

      setTimeout(() => {
        successMessage.value = "";
      }, 1000);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
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
</style>
