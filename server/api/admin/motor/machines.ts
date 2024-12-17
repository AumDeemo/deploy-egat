import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// กำหนดที่จัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // กำหนดให้เก็บไฟล์ในโฟลเดอร์ uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // ตั้งชื่อไฟล์ใหม่
  }
});

const upload = multer({ storage: storage });

export const getMachines = async (req: Request, res: Response) => {
  try {
    const machines = await prisma.Machine.findMany();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching machines', error });
  }
};

export const addMachine = async (req: Request, res: Response) => {
    const { name, description, brand, model, num, capacity, carry, carNum } = req.body;
    const image = req.file ? req.file.filename : '';  // ตรวจสอบว่าไฟล์ถูกส่งมาไหม
  
    console.log(req.body);  // ตรวจสอบข้อมูลที่ได้รับจาก client
    console.log(req.file);   // ตรวจสอบไฟล์ที่ได้รับจาก client
  
    try {
      const newMachine = await prisma.machine.create({
        data: {
          name,
          description,
          brand,
          model,
          num,
          capacity,
          carry,
          carNum,
          image,
        },
      });
      console.log('Machine added:', newMachine);  // ตรวจสอบข้อมูลที่เพิ่มไปแล้ว
      res.status(201).json(newMachine);  // ส่งข้อมูลกลับไปที่ frontend
    } catch (error) {
      console.error('Error adding machine:', error);  // แสดง error ใน console
      res.status(500).json({ message: 'Error adding machine', error });
    }
    
  };
  

// ใช้ multer ใน route ของ Express
// เพิ่มฟังก์ชันการจัดการการอัปโหลดไฟล์
export const uploadMachineImage = upload.single('image');
