import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const categories = await prisma.material.findMany({
      select: {
        category: true,
      },
      distinct: ['category'], // ดึงหมวดหมู่ที่ไม่ซ้ำกัน
    });

    return {
      "status": 'success',
      "data": ["หมวดหมู่ 1", "หมวดหมู่ 2", "หมวดหมู่ 3"]
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้',
    };
  }
});
//api/admin/new/category.get.ts