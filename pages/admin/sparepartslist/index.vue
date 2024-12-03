<script setup>
import adminLayouts from '~/layouts/adminLayouts.vue';

const materials = ref([])

const fetchMaterials = async () => {
    try {
        const response = await fetch('/api/admin/material', {
            method: 'GET',
        });
        if (!response.ok) throw new Error('แสดงข้อมูลอะไหล่ไม่สำเร็จ');
        materials.value = await response.json();
    } catch (err) {
        console.error('แสดงข้อมูลอะไหล่ไม่สำเร็จ:', err);
    }
};

onMounted(async() => {
    await fetchMaterials()
    console.log('data : ' , materials.value)
})
</script>

<template>
    <adminLayouts>
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-center">
                <RouterLink to="/material" class="bg-green-400 w-[500px] rounded-lg p-3 cursor-pointer">
                    <div class="flex gap-2 justify-center">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="#6b7280" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>

                        </div>
                        <p class="text-white">เพิ่มรายการ</p>
                    </div>
                </RouterLink>
            </div>

            <div class="mt-5">
                <div class="overflow-x-auto">
                    <table class="table">
                        <!-- head -->
                        <thead>
                            <tr>
                                <th></th>
                                <th>รายการ</th>
                                <th>PART NUMBER</th>
                                <th>คงเหลือ</th>
                                <th>นำเข้า</th>
                                <th>นำออก</th>
                                <th>รายละเอียดการเบิก</th>
                                <th>แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody v-for="material in materials">
                            <!-- row 1 -->
                            <tr>
                                <th>{{ material.id }}</th>
                                <td>{{ material.name }}</td>
                                <td>{{ material.partnumber}}</td>
                                <td>{{ material.totalAmount}}</td>
                                <td>
                                    <div
                                        class="bg-green-500 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                                stroke-width="4" stroke="#ffffff" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </div>
                                        <p class="text-white">นำเข้า</p>
                                    </div>
                                </td>
                                <td>
                                    <div
                                        class="bg-red-500 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                                stroke-width="4" stroke="#ffffff" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                            </svg>
                                        </div>
                                        <p class="text-white">นำออก</p>
                                    </div>
                                </td>
                                <td>
                                    <div
                                        class="bg-blue-500 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="#6b7280" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                            </svg>
                                        </div>
                                        <p class="text-white">ข้อมูล</p>
                                    </div>
                                </td>

                                <td>
                                    <div
                                        class="bg-orange-400 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="#6b7280" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>

                                        </div>
                                        <p class="text-white">แก้ไข</p>
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </adminLayouts>
</template>

<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
}

.table th {
    background-color: #f4f4f4;
    font-size: small;
}
</style>