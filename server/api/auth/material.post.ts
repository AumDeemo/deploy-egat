import { PrismaClient } from '@prisma/client';
import { createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const { name, partnumber, totalAmount } = await readBody(event);
        console.log('Received data:', { name, partnumber, totalAmount });

        const namepart = await prisma.material.findFirst({ where: { name } });
        console.log('Name Part Exists:', namepart);

        if (namepart) {
            throw createError({
                statusCode: 400,
                message: 'ชื่ออะไหล่ ซ้ำกันในฐานข้อมูล',
            });
        }

        const numpart = await prisma.material.findFirst({ where: { partnumber } });
        console.log('Part Number Exists:', numpart);

        if (numpart) {
            throw createError({
                statusCode: 400,
                message: 'partnumber ซ้ำกันในฐานข้อมูล',
            });
        }

        const newmaterial = await prisma.material.create({
            data: {
                name,
                partnumber,
                totalAmount: parseInt(totalAmount, 10),
            },
        });
        console.log('New Material Created:', newmaterial);

        return {
            message: 'สร้างรายการอะไหล่สำเร็จ',
            material: newmaterial,
        };
    } catch (error: any) {
        console.error('Error occurred:', error.message);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal Server Error',
        });
    }
});
