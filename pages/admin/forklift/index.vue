<template>
  <adminLayouts>
    <h1
      class="text-center text-5xl font-extrabold text-gray-800 tracking-wider mb-10 mt-10"
    >
      Fork Lift
    </h1>
    <div class="mt-10 flex justify-center items-center space-x-10">
      <nuxt-link to="/admin/forklift/big">
        <img
          src="/imgture/IMG_2837.jpeg"
          class="w-[250px] h-[200px] rounded-xl hover:opacity-75 transition duration-200"
          alt="Fork Lift"
        />
        <p class="text-center mt-3 text-xl font-semibold text-gray-700">
          (DOOSAN) Fork Lift
        </p>
      </nuxt-link>
      <nuxt-link to="/admin/forklift/medium">
        <img
          src="/imgture/IMG_2835.jpeg"
          class="w-[250px] h-[200px] rounded-xl hover:opacity-75 transition duration-200"
          alt="Fork Lift"
        />
        <p class="text-center mt-3 text-xl font-semibold text-gray-700">
          (LIUGONG) Fork Lift
        </p>
      </nuxt-link>
      <nuxt-link to="/admin/forklift/medium">
        <img
          src="/imgture/IMG_2836.jpeg"
          class="w-[250px] h-[200px] rounded-xl hover:opacity-75 transition duration-200"
          alt="Fork Lift"
        />
        <p class="text-center mt-3 text-xl font-semibold text-gray-700">
          (ATTACK) Fork Lift
        </p>
      </nuxt-link>
    </div>
  </adminLayouts>
</template>
<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";
</script>

<style scoped>
/* ใส่สไตล์เพิ่มเติมตามต้องการ */
</style>
