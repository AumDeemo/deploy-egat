import { IncomingForm } from 'formidable';
import { writeFile } from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const form = new IncomingForm({ keepExtensions: true });

    return new Promise((resolve, reject) => {
        form.parse(event.node.req, async (err, fields, files) => {
            if (err) {
                return reject({ status: 500, message: 'File parsing failed' });
            }

            const file = files.file as any;
            if (!file) {
                return reject({ status: 400, message: 'No file uploaded' });
            }

            const uploadDir = path.resolve('public/uploads');
            const filePath = path.join(uploadDir, file.newFilename);

            try {
                // Save file to the uploads directory
                await writeFile(filePath, await file.toBuffer());

                // Save file details in the database
                const savedFile = await prisma.file.create({
                    data: {
                        name: file.originalFilename,
                        path: `/uploads/${file.newFilename}`,
                    },
                });

                resolve({
                    status: 200,
                    message: 'File uploaded successfully',
                    file: savedFile,
                });
            } catch (error) {
                reject({ status: 500, message: 'File saving failed', error });
            }
        });
    });
});
