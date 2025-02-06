import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';

const prisma = new PrismaClient();

// สร้าง S3 Client
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

    if (method === 'GET') {
        return await prisma.curu.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    if (method === 'PUT') {
        const form = formidable({ keepExtensions: true });

        try {
            const { fields, files } = await new Promise((resolve, reject) => {
                form.parse(event.node.req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve({ fields, files });
                });
            });

            const curuId = parseInt(fields.id[0]);

            const existingcuru = await prisma.curu.findUnique({
                where: { id: curuId },
            });

            if (!existingcuru) {
                return {
                    status: 'error',
                    message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
                };
            }

            let newImageUrl = existingcuru.imageUrl;
            if (files.image && files.image[0]) {
                const uploadedFile = files.image[0];

                if (existingcuru.imageUrl) {
                    const oldKey = existingcuru.imageUrl.split('.com/')[1];
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
                        Key: `curu/${uniqueFilename}`,
                        Body: fileBuffer,
                        ContentType: uploadedFile.mimetype,
                    })
                );

                newImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/curu/${uniqueFilename}`;
            }

            const updatedcuru = await prisma.curu.update({
                where: { id: curuId },
                data: {
                    number: fields.number ? parseInt(fields.number[0]) : existingcuru.number,
                    name: fields.name ? fields.name[0] : existingcuru.name,
                    brand: fields.brand ? fields.brand[0] : existingcuru.brand,
                    curunumber: fields.curunumber ? fields.curunumber[0] : existingcuru.curunumber,
                    partnumber: fields.partnumber ? fields.partnumber[0] : existingcuru.partnumber,
                    usenumber: fields.usenumber ? fields.usenumber[0] : existingcuru.usenumber,
                    date: fields.date ? new Date(fields.date[0]) : existingcuru.date,
                    detial: fields.detial ? fields.detial[0] : existingcuru.detial,
                    detialnumber: fields.detialnumber ? fields.detialnumber[0] : existingcuru.detialnumber,
                    imageUrl: newImageUrl,
                },
            });

            return {
                status: 'success',
                message: 'อัปเดตข้อมูลสำเร็จ',
                data: updatedcuru,
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
