import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fields, files] = await form.parse(req)
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Generate a unique filename
    const originalName = file.originalFilename || 'unknown'
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)
    const timestamp = Date.now()
    const uniqueName = `${baseName}_${timestamp}${extension}`
    
    // Move file to final location
    const finalPath = path.join(uploadsDir, uniqueName)
    fs.renameSync(file.filepath, finalPath)

    // Return the file URL
    const fileUrl = `/uploads/${uniqueName}`
    
    res.status(200).json({
      fileUrl,
      fileName: originalName,
      fileSize: file.size,
      fileType: file.mimetype,
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
}
