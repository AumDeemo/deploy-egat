import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET method
  if (method === 'GET') {
    return await prisma.using10000.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // PUT method
  if (method === 'PUT') {
    const form = formidable({ keepExtensions: true });

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const using10000Id = parseInt(fields.id[0]);

      const existingusing10000 = await prisma.using10000.findUnique({
        where: { id: using10000Id }
      });

      if (!existingusing10000) {
        return {
          status: 'error',
          message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
        };
      }

      let newImageUrl = existingusing10000.imageUrl;
      if (files.image && files.image[0]) {
        const uploadedFile = files.image[0];

        if (existingusing10000.imageUrl) {
          const oldKey = existingusing10000.imageUrl.split('.com/')[1];
          try {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: oldKey,
              })
            );
          } catch (error) {
            console.error('Error deleting old file from S3:', error);
          }
        }

        const fileExt = uploadedFile.originalFilename.split('.').pop();
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const fileBuffer = fs.readFileSync(uploadedFile.filepath);

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `lowequipment/${uniqueFilename}`,
            Body: fileBuffer,
            ContentType: uploadedFile.mimetype,
          })
        );

        newImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/lowequipment/${uniqueFilename}`;
      }

      const updatedusing10000 = await prisma.using10000.update({
        where: { id: using10000Id },
        data: {
          number: fields.number ? parseInt(fields.number[0]) : existingusing10000.number,
          name: fields.name ? fields.name[0] : existingusing10000.name,
          brand: fields.brand ? fields.brand[0] : existingusing10000.brand,
          curunumber: fields.curunumber ? fields.curunumber[0] : existingusing10000.curunumber,
          partnumber: fields.partnumber ? fields.partnumber[0] : existingusing10000.partnumber,
          usenumber: fields.usenumber ? fields.usenumber[0] : existingusing10000.usenumber,
          date: fields.date ? fields.date[0] : existingusing10000.date,
          detial: fields.detial ? fields.detial[0] : existingusing10000.detial,
          detialnumber: fields.detialnumber ? fields.detialnumber[0] : existingusing10000.detialnumber,
          imageUrl: newImageUrl,
        },
      });

      return {
        status: 'success',
        message: 'อัปเดตข้อมูลสำเร็จ',
        data: updatedusing10000,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
        error: error.message,
      };
    }
  }

});