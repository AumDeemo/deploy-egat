import { PrismaClient } from '@prisma/client';
import { H3Event } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body = await readBody(event);
        const { name, partnumber, totalAmount } = body;

        if (!name || !partnumber || !totalAmount) {
            throw createError({
                statusCode: 400,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
        }

        const newMaterial = await prisma.material.create({
            data: {
                name: name,
                partnumber: partnumber,
                totalAmount: parseInt(totalAmount, 10),
            },
        });

        return {
            message: 'สร้างรายการอะไหล่สำเร็จ',
            material: newMaterial,
        };
    } catch (error: unknown) {
        console.error('Error occurred:', error);
        
        if (error instanceof Error) {
            throw createError({
                statusCode: 500,
                message: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
            });
        }

        throw createError({
            statusCode: 500,
            message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
        });
    } finally {
        await prisma.$disconnect();
    }
});