<script setup>
import { ref } from 'vue'
import adminLayouts from '~/layouts/adminLayouts.vue'

const materials = ref([])
const selectedMaterial = ref(null)
const modalType = ref(null)
const quantity = ref('')

// Modal types
const MODAL_TYPES = {
    IMPORT: 'import',
    EXPORT: 'export',
    DETAILS: 'details',
    EDIT: 'edit'
}

// Fetch materials
const fetchMaterials = async () => {
    try {
        const response = await fetch('/api/admin/material', {
            method: 'GET',
        })
        if (!response.ok) throw new Error('แสดงข้อมูลอะไหล่ไม่สำเร็จ')
        materials.value = await response.json()
    } catch (err) {
        console.error('แสดงข้อมูลอะไหล่ไม่สำเร็จ:', err)
    }
}

const openModal = (type, material) => {
    modalType.value = type
    selectedMaterial.value = material
    quantity.value = ''
}

const closeModal = () => {
    modalType.value = null
    selectedMaterial.value = null
    quantity.value = ''
}

watch(quantity, (newValue) => {
    console.log('quantity:', newValue)
})

watch(selectedMaterial, (newValue) => {
    console.log('selectedMaterial.value.id :', newValue)
})

const handleMaterialAction = async () => {
    if (!selectedMaterial.value || !quantity.value) return

    try {
        const actionType = modalType.value === MODAL_TYPES.IMPORT ? 'import' : 'export'
        const response = await fetch('/api/admin/material-action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                materialId: selectedMaterial.value.id,
                quantity: Number(quantity.value),
                type: actionType
            })
        })

        if (!response.ok) throw new Error(`การ${actionType}ไม่สำเร็จ`)

        await fetchMaterials()
        closeModal()
    } catch (err) {
        console.error(`Error in ${actionType}:`, err)
        // TODO: Add proper error handling (e.g., toast notification)
    }
}

const handleEditMaterial = async () => {
    if (!selectedMaterial.value) return

    try {
        const response = await fetch('/api/admin/material', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: selectedMaterial.value.id,
                ...selectedMaterial.value
            })
        })

        if (!response.ok) throw new Error('แก้ไขข้อมูลไม่สำเร็จ')

        await fetchMaterials()
        closeModal()
    } catch (err) {
        console.error('Error editing material:', err)
        // TODO: Add proper error handling
    }
}

onMounted(async () => {
    await fetchMaterials()
})
</script>

<template>
    <adminLayouts>
        <div class="max-w-7xl mx-auto">
            <!-- Add Material Button -->
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

            <!-- Materials Table -->
            <div class="mt-5">
                <div class="overflow-x-auto">
                    <table class="table">
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
                        <tbody>
                            <tr v-for="material in materials" :key="material.id">
                                <th>{{ material.id }}</th>
                                <td>{{ material.name }}</td>
                                <td>{{ material.partnumber }}</td>
                                <td>{{ material.totalAmount }}</td>
                                <td>
                                    <div @click="openModal(MODAL_TYPES.IMPORT, material)"
                                        class="bg-green-500 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                            stroke-width="4" stroke="#ffffff" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        <p class="text-white">นำเข้า</p>
                                    </div>
                                </td>
                                <td>
                                    <div @click="openModal(MODAL_TYPES.EXPORT, material)"
                                        class="bg-red-500 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                            stroke-width="4" stroke="#ffffff" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                        </svg>
                                        <p class="text-white">นำออก</p>
                                    </div>
                                </td>
                                <td>
                                    <div @click="openModal(MODAL_TYPES.DETAILS, material)"
                                        class="bg-blue-500 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="#6b7280" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                        </svg>
                                        <p class="text-white">ข้อมูล</p>
                                    </div>
                                </td>
                                <td>
                                    <div @click="openModal(MODAL_TYPES.EDIT, material)"
                                        class="bg-orange-400 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="#6b7280" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        <p class="text-white">แก้ไข</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modals -->
            <!-- Import/Export Modal -->
            <div v-if="modalType === MODAL_TYPES.IMPORT || modalType === MODAL_TYPES.EXPORT"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg w-96">
                    <h2 class="text-xl font-bold mb-4">
                        {{ modalType === MODAL_TYPES.IMPORT ? 'นำเข้า' : 'นำออก' }} {{ selectedMaterial?.name }}
                    </h2>
                    <input v-model="quantity" type="number" placeholder="ระบุจำนวน"
                        class="w-full p-2 border rounded mb-4" />
                    <div class="flex justify-between">
                        <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
                            ยกเลิก
                        </button>
                        <button @click="handleMaterialAction" class="bg-green-500 text-white px-4 py-2 rounded">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>

            <!-- Details Modal -->
            <div v-if="modalType === MODAL_TYPES.DETAILS"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg w-96">
                    <h2 class="text-xl font-bold mb-4">รายละเอียด {{ selectedMaterial?.name }}</h2>
                    <div class="space-y-2">
                        <p><strong>Part Number:</strong> {{ selectedMaterial?.partnumber }}</p>
                        <p><strong>จำนวนคงเหลือ:</strong> {{ selectedMaterial?.totalAmount }}</p>
                        <!-- Add more details as needed -->
                    </div>
                    <div class="mt-4 text-right">
                        <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
                            ปิด
                        </button>
                    </div>
                </div>
            </div>

            <!-- Edit Modal -->
            <div v-if="modalType === MODAL_TYPES.EDIT"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg w-96">
                    <h2 class="text-xl font-bold mb-4">แก้ไข {{ selectedMaterial?.name }}</h2>
                    <div class="space-y-4">
                        <input v-model="selectedMaterial.name" placeholder="ชื่อรายการ"
                            class="w-full p-2 border rounded" />
                        <input v-model="selectedMaterial.partnumber" placeholder="Part Number"
                            class="w-full p-2 border rounded" />
                        <!-- Add more editable fields as needed -->
                    </div>
                    <div class="flex justify-between mt-4">
                        <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
                            ยกเลิก
                        </button>
                        <button @click="handleEditMaterial" class="bg-green-500 text-white px-4 py-2 rounded">
                            บันทึก
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