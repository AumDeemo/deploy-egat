import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // ดึงข้อมูลเครื่องจักรทั้งหมดจากฐานข้อมูล
    const machines = await prisma.machine.findMany({
      orderBy: { createdAt: 'desc' }, // เรียงลำดับตามวันที่สร้างใหม่ล่าสุด
    });

    // ส่งข้อมูลกลับไปยัง Client
    return {
      success: true,
      data: machines,
    };
  } catch (error) {
    console.error("Error fetching machines:", error);

    // กรณีเกิดข้อผิดพลาด
    return {
      success: false,
      error: "Failed to fetch machines",
    };
  }
});
