import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { name, partnumber, totalAmount } = await readBody(event);

    const namepart = await prisma.material.findFirst({
        where: { name },
    });

    if (namepart){
        throw createError({
            statusCode: 400,
            message: 'ชื่ออะไหล่ ซ้ำกันในฐานข้อมูล'
        })
    }

    const numpart = await prisma.material.findFirst({
        where: { partnumber },
    })

    if(numpart){
        throw createError({
            statusCode: 400,
            message: 'partnumber ซ้ำกันในฐานข้อมูล'
        })
    }

    const newmaterial = await prisma.material.create({
        data: {
            name,
            partnumber,
            totalAmount
        }
    });

    return {
        message: 'สร้างรายการอะไหล่สำเร็จ',
        material: newmaterial,
    };

});