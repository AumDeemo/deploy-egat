<template>
  <div class="flex items-center justify-center mt-10 font-prompt">
    <form @submit.prevent="material" class="card w-full max-w-sm bg-yellow-300 shadow-md">
      <div class="card-body">
        <div class="flex justify-center">
          <div class="flex">
            <img
              src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png "
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

        <div class="">
          <form @submit.prevent="material">
            <div class="form-control select-none">
              <label>ชื่ออะไหล่</label>
              <input
                v-model="name"
                type="name"
                placeholder=""
                class="input input-bordered"
              />
            </div>
            <div class="form-control mt-5 select-none">
              <label>Part number</label>
              <input
                v-model="partnumber"
                type="partnumber"
                placeholder=""
                class="input input-bordered"
              />
            </div>
            <div class="form-control mt-5 select-none">
              <label>จำนวน</label>
              <input
                v-model="totalAmount"
                type="totalAmount"
                placeholder=""
                class="input input-bordered"
              />
            </div>
            <div class="form-control mt-5">
              <button type="submit" class="btn btn-accent text-white font-light">
                ยืนยัน
              </button>
            </div>
          </form>
        </div>

        <RouterLink to="admin/sparepartslist" class="flex justify-center">
          <div class="flex justify-center bg-black p-2 rounded-xl">
            <p class="text-white text-sm select-none">กลับหน้าแรก</p>
          </div>
        </RouterLink>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from "vue";

const name = ref("");
const partnumber = ref("");
const totalAmount = ref("");
const successMessage = ref(""); // ข้อความแจ้งเตือน

const material = async () => {
  console.log("Submitting material function");
  console.log({
    name: name.value,
    partnumber: partnumber.value,
    totalAmount: totalAmount.value,
  });

  try {
    const response = await $fetch("/api/auth/material", {
      method: "POST",
      body: {
        name: name.value,
        partnumber: partnumber.value,
        totalAmount: totalAmount.value,
      },
    });
    console.log("Response:", response);
    // แสดงข้อความแจ้งเตือนเมื่อเพิ่มสำเร็จ
    successMessage.value = "เพิ่มข้อมูลสำเร็จ!";

    // ล้างฟอร์ม
    name.value = "";
    partnumber.value = "";
    totalAmount.value = "";

    // ซ่อนข้อความแจ้งเตือนหลัง 3 วินาที
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
    alert(error.message || "เกิดข้อผิดพลาด");
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
</style>
