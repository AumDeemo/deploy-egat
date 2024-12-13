import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // ใช้ readBody แทน useBody
  const file = body.file;

  if (file && file.name && file.data) {
    const uploadsDir = './admin/curu';

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const path = `${uploadsDir}/${file.name}`;

    // บันทึกไฟล์ลงใน server
    fs.writeFileSync(path, file.data);

    try {
      const savedFile = await prisma.file.create({
        data: {
          name: file.name,
          path: path,
        },
      });

      return savedFile;
    } catch (error) {
      console.error(error);
      throw new Error('Error saving file to database');
    }
  } else {
    throw new Error('No valid file uploaded');
  }
});
