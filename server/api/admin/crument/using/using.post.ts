import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import formidable from 'formidable';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    const form = formidable({ keepExtensions: true });

    try {
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const uploadedFile = files.image?.[0];
        if (!uploadedFile) throw new Error('No image file received');

        const fileExt = uploadedFile.originalFilename.split('.').pop();
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const fileBuffer = fs.readFileSync(uploadedFile.filepath);

        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `equipment/${uniqueFilename}`,
            Body: fileBuffer,
            ContentType: uploadedFile.mimetype,  
        }));

        const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/equipment/${uniqueFilename}`;

        const using = await prisma.using1.create({
            data: {
                number: fields.number?.[0] ? parseInt(fields.number[0]) : null,
                name: fields.name?.[0] ,
                brand: fields.brand?.[0],
                curunumber: fields.curunumber?.[0],
                partnumber: fields.partnumber?.[0],
                usenumber: fields.usenumber?.[0],
                date: fields.date?.[0] ? new Date(fields.date[0]) : null,
                detial: fields.detial?.[0],
                detialnumber: fields.detialnumber?.[0],
                imageUrl,
            },
        });

        return {
            status: 'success',
            message: 'บันทึกข้อมูลสำเร็จ',
            data: using,
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            status: 'error',
            message: `เกิดข้อผิดพลาด: ${error.message}`,
        };
    }
});
