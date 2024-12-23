<template>
  <adminLayouts>
    <!-- หัวข้อ -->
    <h1
      class="text-center text-5xl font-extrabold text-gray-800 tracking-wider mb-5 mt-5"
    >
      เครื่องจักรที่รับผิดชอบ
    </h1>

    <div class="flex justify-center w-full mb-4">
      <!-- ปุ่มเปิดฟอร์มกรอกข้อมูลเครื่องจักรใหม่ -->
      <button
        @click="openForm"
        class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
      >
        + เพิ่มข้อมูลเครื่องจักร
      </button>
    </div>

    <!-- ฟอร์มกรอกข้อมูลเครื่องจักร -->
    <div
      v-if="isFormOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-0 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closeForm"
          aria-label="Close Form"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 class="text-2xl font-bold text-gray-800 mb-3">เพิ่มข้อมูลเครื่องจักร</h2>

        <!-- ฟอร์มกรอกข้อมูลเครื่องจักร -->
        <form @submit.prevent="addMachine">
          <div class="mb-4">
            <label for="name" class="block text-sm font-semibold">ชื่อเครื่องจักร</label>
            <input
              v-model="newMachine.name"
              type="text"
              id="name"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <!-- หัวข้อ "รายละเอียด" ไม่มีฟิลด์กรอก -->
          <div class="mb-4 text-center">
            <label class="block text-sm font-semibold">รายละเอียด</label>
            <p class="text-gray-600">กรุณากรอกข้อมูลเครื่องจักรในส่วนอื่น ๆ</p>
          </div>

          <div class="mb-4">
            <label for="brand" class="block text-sm font-semibold">ยี่ห้อ</label>
            <input
              v-model="newMachine.brand"
              type="text"
              id="brand"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="model" class="block text-sm font-semibold">รุ่น</label>
            <input
              v-model="newMachine.model"
              type="text"
              id="model"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="num" class="block text-sm font-semibold">หมายเลขกฟผ.</label>
            <input
              v-model="newMachine.num"
              type="text"
              id="num"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="capacity" class="block text-sm font-semibold">ความจุ</label>
            <input
              v-model="newMachine.capacity"
              type="text"
              id="capacity"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="carry" class="block text-sm font-semibold">น้ำหนักยก</label>
            <input
              v-model="newMachine.carry"
              type="text"
              id="carry"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="carNum" class="block text-sm font-semibold">เลขทะเบียน</label>
            <input
              v-model="newMachine.carNum"
              type="text"
              id="carNum"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="image" class="block text-sm font-semibold">เลือกภาพ</label>
            <input
              @change="handleImageUpload"
              type="file"
              id="image"
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- แสดงข้อมูลเครื่องจักรที่ดึงมาจากฐานข้อมูล -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">รายการเครื่องจักร</h2>
      <div v-if="machines.length === 0" class="text-gray-500">ไม่มีข้อมูลเครื่องจักร</div>
      <div v-else>
        <div
          v-for="machine in machines"
          :key="machine.id"
          class="mb-4 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex gap-4">
            <img
              v-if="machine.image"
              :src="machine.image"
              alt="Machine Image"
              class="w-1/2 max-h-64 object-cover rounded-lg mb-4"
            />
            <div>
              <h3 class="text-lg font-semibold mb-4">{{ machine.name }}</h3>
              <p><strong>ยี่ห้อ:</strong> {{ machine.brand }}</p>
              <p><strong>รุ่น:</strong> {{ machine.model }}</p>
              <p><strong>หมายเลขกฟผ.:</strong> {{ machine.num }}</p>
              <p><strong>ความจุ:</strong> {{ machine.capacity }}</p>
              <p><strong>น้ำหนักยก:</strong> {{ machine.carry }}</p>
              <p><strong>เลขทะเบียน:</strong> {{ machine.carNum }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const isModalOpen = ref(false);
const isFormOpen = ref(false);
const machines = ref([]); // ข้อมูลเครื่องจักรที่ดึงมาจาก API

const newMachine = ref({
  name: "",
  brand: "",
  model: "",
  num: "",
  capacity: "",
  carry: "",
  carNum: "",
  image: "",
});

const openForm = () => {
  isFormOpen.value = true;
};

const closeForm = () => {
  isFormOpen.value = false;
};

const fetchMachines = async () => {
  try {
    const response = await fetch("/api/admin/motor/machines", {
      method: "GET",
    });
    if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลเครื่องจักรได้");
    const data = await response.json();
    machines.value = data.data; // กำหนดข้อมูลที่ดึงมาใน machines
  } catch (error) {
    console.error("Error fetching machines:", error);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newMachine.value.image = file;
  }
};

const addMachine = async () => {
  try {
    const formData = new FormData();
    formData.append("name", newMachine.value.name);
    formData.append("brand", newMachine.value.brand);
    formData.append("model", newMachine.value.model);
    formData.append("num", newMachine.value.num);
    formData.append("capacity", newMachine.value.capacity);
    formData.append("carry", newMachine.value.carry);
    formData.append("carNum", newMachine.value.carNum);
    if (newMachine.value.image) {
      formData.append("image", newMachine.value.image);
    }

    const response = await fetch("/api/admin/motor/machines", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("ไม่สามารถเพิ่มข้อมูลเครื่องจักรได้");

    const result = await response.json();
    alert("เพิ่มข้อมูลเครื่องจักรสำเร็จ");

    // รีเซ็ตฟอร์ม
    closeForm();
    newMachine.value = {
      name: "",
      brand: "",
      model: "",
      num: "",
      capacity: "",
      carry: "",
      carNum: "",
      image: "",
    };

    // อัปเดตรายการเครื่องจักร
    await fetchMachines();
  } catch (error) {
    console.error("Error adding machine:", error);
    alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูลเครื่องจักร");
  }
};

onMounted(async () => {
  await fetchMachines(); // เรียกฟังก์ชัน fetchMachines เมื่อ component โหลดเสร็จ
});
</script>

<style scoped>
/* ปรับแต่ง scrollbar ให้สวยงาม */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.max-h {
  max-height: 90vh;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
