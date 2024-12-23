<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

// ตัวแปรที่ใช้เก็บข้อมูล
const materials = ref([]); // รายการวัสดุทั้งหมด
const isConfirming = ref(null); // ตรวจสอบว่ากำลังยืนยันการอัปโหลดไฟล์หรือไม่
const selectedImage = ref(null); // เก็บไฟล์ภาพที่เลือก
const searchQuery = ref(""); // คำค้นหาสำหรับกรองวัสดุ
const uploadError = ref(null); // เก็บข้อความผิดพลาดการอัปโหลด

const categories = ref([]); // ตัวแปรเก็บหมวดหมู่
const selectedCategory = ref(""); // ตัวแปรเก็บหมวดหมู่ที่เลือก

// ฟังก์ชันดึงข้อมูลวัสดุ
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

// ฟังก์ชันดึงข้อมูลหมวดหมู่
const fetchCategories = async () => {
  try {
    const response = await fetch("/api/admin/new/category", {
      method: "GET",
    });
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data; // เก็บหมวดหมู่ในตัวแปร
    } else {
      console.error("Error fetching categories:", result.message);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

// กรองวัสดุตามหมวดหมู่และคำค้นหา
const filteredMaterials = computed(() => {
  let filtered = materials.value;
  
  // กรองตามหมวดหมู่ที่เลือก
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (material) => material.category === selectedCategory.value
    );
  }

  // กรองตามคำค้นหาหลายคำที่พิมพ์ (ค้นหาจากชื่อวัสดุและหมวดหมู่)
  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" "); // แยกคำค้นหา

    filtered = filtered.filter((material) => {
      // ตรวจสอบทุกคำในคำค้นหาที่ถูกแยก
      return searchTerms.every((term) => {
        return (
          (material.name?.toLowerCase().includes(term)) || // ค้นหาจากชื่อวัสดุ
          (material.category?.toLowerCase().includes(term)) || // ค้นหาจากหมวดหมู่
          (material.partnumber?.toLowerCase().includes(term))   // ค้นหาจาก Part Number
        );
      });
    });
  }

  console.log(filtered); // ตรวจสอบผลลัพธ์ที่ถูกกรอง
  return filtered;
});


// ฟังก์ชันการอัปโหลดภาพ
const handleFileChange = (event, materialId) => {
  const file = event.target.files[0];
  uploadError.value = null;
  
  if (!file) {
    selectedImage.value = null;
    isConfirming.value = null;
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadError.value = "Please select an image file";
    event.target.value = ''; // Clear the file input
    return;
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = "File size must be less than 5MB";
    event.target.value = '';
    return;
  }

  selectedImage.value = file;
  isConfirming.value = materialId;
};

// ฟังก์ชันยืนยันการอัปโหลดภาพ
const confirmUpdateImage = async (materialId) => {
  if (!selectedImage.value) return;
  
  const formData = new FormData();
  formData.append("image", selectedImage.value);
  
  try {
    const response = await fetch(`/api/test/material/${materialId}`, {
      method: "PUT",
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update image");
    }
    
    const result = await response.json();
    
    if (result.body?.data) {
      // Update the material in the local state
      const index = materials.value.findIndex((item) => item.id === materialId);
      if (index !== -1) {
        materials.value[index] = result.body.data;
      }
      
      // Reset the state
      isConfirming.value = null;
      selectedImage.value = null;
      uploadError.value = null;
      
      // Clear the file input
      const fileInput = document.querySelector(`#file-input-${materialId}`);
      if (fileInput) fileInput.value = "";
    }
  } catch (err) {
    console.error("Error updating image:", err);
    uploadError.value = err.message || "Failed to update image. Please try again.";
  }
};

// ฟังก์ชันยกเลิกการอัปโหลด
const cancelUpdate = (materialId) => {
  isConfirming.value = null;
  selectedImage.value = null;
  uploadError.value = null;
  const fileInput = document.querySelector(`#file-input-${materialId}`);
  if (fileInput) fileInput.value = "";
};

// ดึงข้อมูลวัสดุและหมวดหมู่เมื่อ component ถูก mount
onMounted(async () => {
  await Promise.all([fetchMaterials(), fetchCategories()]);
});
</script>

<template>
  <adminLayouts>
    <div class="mb-4 flex items-center gap-4">
      <!-- ช่องค้นหา -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหา"
        class="w-1/3 p-3 border border-gray-300 rounded-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
      />

      <!-- Dropdown เลือกหมวดหมู่ -->
      <select
        v-model="selectedCategory"
        class="select select-bordered select-sm w-full max-w-xs"
      >
        <option value="">ทั้งหมด</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <div v-if="uploadError" class="alert alert-error mb-4">
      {{ uploadError }}
    </div>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(material, index) in filteredMaterials" :key="material.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img 
                :src="material.imageUrl" 
                alt="" 
                class="w-24 h-24 object-cover"
              >
            </td>
            <td>{{ material.name }}</td>

            <td>
              <div class="flex flex-col gap-2">
                <input 
                  type="file" 
                  :id="'file-input-' + material.id"
                  @change="(e) => handleFileChange(e, material.id)" 
                  accept="image/*"
                  class="file-input file-input-bordered file-input-sm w-full max-w-xs"
                >

                <!-- Confirmation buttons -->
                <div v-if="isConfirming === material.id" class="flex gap-2">
                  <button
                    class="btn btn-sm btn-success"
                    @click="confirmUpdateImage(material.id)"
                  >
                    Confirm
                  </button>
                  <button
                    class="btn btn-sm btn-error"
                    @click="cancelUpdate(material.id)"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </adminLayouts>
</template>
