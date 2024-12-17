// server/api/files/upload.ts
import fs from 'fs'
import path from 'path'
import { H3Event } from 'h3'
import formidable from 'formidable'

export default defineEventHandler(async (event: H3Event) => {
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'file')

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    return new Promise((resolve, reject) => {
        const form = formidable({
            uploadDir,
            keepExtensions: true,
            maxFileSize: 50 * 1024 * 1024, // 50MB max file size
            filter: (part) => {
                // Only allow .xlsx files
                return part.originalFilename?.endsWith('.xlsx') || false
            }
        })

        form.parse(event.node.req, (err, fields, files) => {
            if (err) {
                console.error('Formidable parse error:', err)
                return reject(createError({
                    statusCode: 400,
                    statusMessage: 'File upload failed',
                    message: err.message
                }))
            }

            // Get the first file from the files object
            const fileArray = files.file as formidable.File[]
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray

            // Detailed logging for debugging
            console.log('Uploaded file details:', file)

            // Check if file was uploaded successfully
            if (!file || !file.filepath) {
                console.error('No valid file found')
                return reject(createError({
                    statusCode: 400,
                    statusMessage: 'No file uploaded',
                    message: 'Please upload a valid .xlsx file'
                }))
            }

            try {
                // Generate a unique filename to prevent overwriting
                const fileName = `${Date.now()}_${file.originalFilename}`
                const newPath = path.join(uploadDir, fileName)

                // Ensure filepath exists and is a string
                if (!file.filepath) {
                    throw new Error('Temporary file path is undefined')
                }

                // Rename the file to the new path
                fs.renameSync(file.filepath, newPath)

                // Respond with file details
                resolve({
                    file: {
                        name: fileName,
                        originalName: file.originalFilename,
                        path: `/file/${fileName}`,
                        size: file.size,
                        type: file.mimetype
                    }
                })
            } catch (renameError) {
                console.error('File rename error:', renameError)
                reject(createError({
                    statusCode: 500,
                    statusMessage: 'File processing failed',
                    message: 'Unable to save uploaded file'
                }))
            }
        })
    })
})