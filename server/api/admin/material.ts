import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";

const prisma = new PrismaClient();

// ตั้งค่า AWS S3
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
  if (method === "GET") {
    return await prisma.material.findMany({
      include: {
        importHistory: true,
        exportHistory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // POST method
  if (method === "POST") {
    const form = formidable({
      uploadDir: "./public/material",
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      let imageUrl = null;
      if (files.image && files.image[0]) {
        const uploadedFile = files.image[0];
        imageUrl = `/material/${uploadedFile.newFilename}`;
      }

      const material = await prisma.material.create({
        data: {
          name: fields.name[0],
          partNumber: fields.partnumber[0],
          totalAmount: parseInt(fields.totalAmount[0]),
          imageUrl: imageUrl,
        },
      });

      return {
        status: "success",
        message: "บันทึกข้อมูลสำเร็จ",
        data: material,
      };
    } catch (error) {
      return {
        status: "error",
        message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        error: error.message,
      };
    }
  }

  // PUT method
  if (method === "PUT") {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      keepExtensions: true,
    });

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const materialId = parseInt(fields.id?.[0]);
      if (!materialId)
        return { status: "error", message: "Missing material ID" };

      // ดึงข้อมูลปัจจุบันจากฐานข้อมูล
      const existingMaterial = await prisma.material.findUnique({
        where: { id: materialId },
      });
      if (!existingMaterial) {
        return { status: "error", message: "ไม่พบข้อมูลที่ต้องการแก้ไข" };
      }

      // อัปเดตค่าอื่น ๆ ถ้ามี
      const name = fields.name?.[0] || existingMaterial.name;
      const partNumber = fields.partnumber?.[0] || existingMaterial.partNumber;
      const totalAmount = fields.totalAmount?.[0]
        ? parseInt(fields.totalAmount[0])
        : existingMaterial.totalAmount;

      let imageUrl = existingMaterial.imageUrl;

      // ถ้ามีการอัปโหลดรูปภาพใหม่
      if (files.image && files.image[0]) {
        const uploadedFile = files.image[0];

        // ตรวจสอบว่ามีไฟล์อยู่จริง
        if (!fs.existsSync(uploadedFile.filepath)) {
          return { status: "error", message: "ไฟล์ไม่พบในเซิร์ฟเวอร์" };
        }

        const fileExt = uploadedFile.originalFilename.split(".").pop();
        const uniqueFilename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        // ลบไฟล์เก่าออกจาก S3 ถ้ามี
        if (existingMaterial.imageUrl) {
          try {
            // ใช้วิธีที่ปลอดภัยกว่าในการดึง Key
            const imageUrlObject = new URL(existingMaterial.imageUrl);
            const key = imageUrlObject.pathname.substring(1); // ตัด "/" ออกจาก path

            console.log("🔹 Key to delete from S3:", key); // ตรวจสอบค่า Key ที่จะใช้ลบไฟล์

            if (key) {
              await s3.send(
                new DeleteObjectCommand({
                  Bucket: BUCKET_NAME,
                  Key: key,
                })
              );
            } else {
              console.warn("⚠️ No valid key found for S3 delete.");
            }
          } catch (error) {
            console.error("🚨 Error deleting old image from S3:", error);
          }
        }

        // อัปโหลดรูปใหม่ไปยัง S3
        try {
          const upload = new Upload({
            client: s3,
            params: {
              Bucket: BUCKET_NAME,
              Key: `material/${uniqueFilename}`,
              Body: fs.createReadStream(uploadedFile.filepath),
              ContentType: uploadedFile.mimetype,
            },
          });

          await upload.done(); // รอให้การอัปโหลดเสร็จสมบูรณ์

          // ตั้งค่า URL ใหม่
          imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/material/${uniqueFilename}`;
        } catch (error) {
          return {
            status: "error",
            message: "อัปโหลดไฟล์ไป S3 ไม่สำเร็จ",
            error: error.message,
          };
        }
      }

      const updatedMaterial = await prisma.material.update({
        where: { id: materialId },
        data: {
          name: fields.name ? fields.name[0] : existingMaterial.name,
          partnumber: fields.partnumber
            ? fields.partnumber[0]
            : existingMaterial.partNumber,
          totalAmount: fields.totalAmount
            ? parseInt(fields.totalAmount[0])
            : existingMaterial.totalAmount,
          imageUrl,
        },
      });

      return {
        status: "success",
        message: "อัปเดตข้อมูลสำเร็จ",
        data: updatedMaterial,
      };
    } catch (error) {
      return {
        status: "error",
        message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
        error: error.message,
      };
    }
  }

  // DELETE method
  if (method === "DELETE") {
    try {
      const query = getQuery(event);
      const id = Number(query.id);

      const material = await prisma.material.findUnique({
        where: { id },
      });

      if (material?.imageUrl) {
        const imagePath = `./public${material.imageUrl}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await prisma.material.delete({
        where: { id },
      });

      return {
        status: "success",
        message: "ลบข้อมูลสำเร็จ",
      };
    } catch (error) {
      return {
        status: "error",
        message: "เกิดข้อผิดพลาดในการลบข้อมูล",
        error: error.message,
      };
    }
  }
});
