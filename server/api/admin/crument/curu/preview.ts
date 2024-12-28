import { PrismaClient } from '@prisma/client';
import { H3Event } from 'h3';
import { join } from 'path';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { id } = getQuery(event);

    if (!id) {
      return { error: 'Missing file ID.' };
    }

    // ดึงข้อมูลไฟล์จากฐานข้อมูล
    const file = await prisma.curu.findUnique({
      where: { id: Number(id) },
    });

    if (!file) {
      return { error: 'File not found.' };
    }

    // ตรวจสอบว่ามีไฟล์จริงหรือไม่
    const filePath = join('public/crument/curu', file.path);
    try {
      await fs.access(filePath);
    } catch {
      return { error: 'File not found in storage.' };
    }

    // ส่งข้อมูลไฟล์กลับไป
    return {
      name: file.name,
      path: `/crument/curu/${file.path}`,
    };
  } catch (error) {
    return { error: 'Internal Server Error', details: error.message };
  }
});
