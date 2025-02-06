import { PrismaClient } from '@prisma/client'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const prisma = new PrismaClient()
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME

export default defineEventHandler(async (event) => {
    const { method } = event.req

    try {
        switch (method) {
            case 'POST': {
                const formData = await readMultipartFormData(event)
                if (!formData) throw new Error('No form data received')

                // Extract form data
                const imageFile = formData.find(item => item.name === 'image')
                const name = formData.find(item => item.name === 'name')?.data.toString()
                const partnumber = formData.find(item => item.name === 'partnumber')?.data.toString()
                const totalAmount = formData.find(item => item.name === 'totalAmount')?.data.toString()
                const category = formData.find(item => item.name === 'category')?.data.toString()

                if (!imageFile || !imageFile.filename) throw new Error('No image file received')

                const fileExt = imageFile.filename.split('.').pop()
                const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`


                await s3.send(
                    new PutObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: `material/${uniqueFilename}`,
                        Body: imageFile.data,
                        ContentType: imageFile.type,
                    })
                )

                // Create material record in database
                const material = await prisma.material.create({
                    data: {
                        name,
                        partnumber,
                        totalAmount: parseInt(totalAmount),
                        category: category,
                        imageUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/material/${uniqueFilename}`,
                    },
                })

                return {
                    status: 'success',
                    message: 'Material created successfully',
                    data: material
                }
            }
            case 'PUT': {
                const formData = await readMultipartFormData(event)
                if (!formData) throw new Error('No form data received')

                const id = formData.find(item => item.name === 'id')?.data.toString()
                if (!id) throw new Error('Material ID is required for update')

                const name = formData.find(item => item.name === 'name')?.data.toString()
                const partnumber = formData.find(item => item.name === 'partnumber')?.data.toString()
                const totalAmount = formData.find(item => item.name === 'totalAmount')?.data.toString()
                const category = formData.find(item => item.name === 'category')?.data.toString()
                const imageFile = formData.find(item => item.name === 'image')

                // ค้นหา Material ที่ต้องการอัปเดต
                const existingMaterial = await prisma.material.findUnique({ where: { id: parseInt(id) } })
                if (!existingMaterial) throw new Error('Material not found')

                let newImageUrl = existingMaterial.imageUrl

                if (imageFile && imageFile.filename) {
                    // สร้างชื่อไฟล์ใหม่
                    const fileExt = imageFile.filename.split('.').pop()
                    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

                    // ลบรูปเก่าออกจาก S3 ก่อน (ถ้ามี)
                    if (existingMaterial.imageUrl) {
                        const oldKey = existingMaterial.imageUrl.split('.com/')[1]
                        try {
                            await s3.send(
                                new DeleteObjectCommand({
                                    Bucket: BUCKET_NAME,
                                    Key: oldKey,
                                })
                            )
                        } catch (error) {
                            console.error('Error deleting old file from S3:', error)
                        }
                    }

                    // อัปโหลดรูปใหม่ไปที่ S3
                    await s3.send(
                        new PutObjectCommand({
                            Bucket: BUCKET_NAME,
                            Key: `material/${uniqueFilename}`,
                            Body: imageFile.data,
                            ContentType: imageFile.type,
                        })
                    )

                    newImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/material/${uniqueFilename}`
                }

                // อัปเดตข้อมูลลงฐานข้อมูล
                const updatedMaterial = await prisma.material.update({
                    where: { id: parseInt(id) },
                    data: {
                        name,
                        partnumber,
                        totalAmount: totalAmount ? parseInt(totalAmount) : undefined,
                        category,
                        imageUrl: newImageUrl,
                    },
                })

                return {
                    status: 'success',
                    message: 'Material updated successfully',
                    data: updatedMaterial
                }
            }

            case 'DELETE': {
                const { id: deleteId } = await readBody(event)
                if (!deleteId) return { error: 'Material ID is required for deletion.' }

                const material = await prisma.material.findUnique({
                    where: { id: deleteId },
                })

                if (material?.imageUrl) {
                    const key = material.imageUrl.split('.com/')[1]
                    try {
                        await s3.send(
                            new DeleteObjectCommand({
                                Bucket: BUCKET_NAME,
                                Key: key,
                            })
                        )
                    } catch (error) {
                        console.error('Error deleting file from S3:', error)
                    }
                }

                await prisma.material.delete({ where: { id: deleteId } })
                return {
                    status: 'success',
                    message: 'Material deleted successfully'
                }
            }

            case 'GET':
                const materials = await prisma.material.findMany()
                return {
                    status: 'success',
                    data: materials
                }

            default:
                return { error: 'Method not allowed' }
        }
    } catch (error) {
        console.error('Error in Material handler:', error)
        return {
            status: 'error',
            message: error.message
        }
    }
})