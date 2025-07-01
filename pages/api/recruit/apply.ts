import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/app/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file types
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// File size limits (bytes)
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_COVER_LETTER_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_RECOMMENDATION_SIZE = 3 * 1024 * 1024; // 3MB each
const MAX_CERTIFICATE_SIZE = 3 * 1024 * 1024; // 3MB each

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB total, individual files checked later
    multiples: true,
  });

  function parseForm(req: NextApiRequest): Promise<{ fields: any; files: any }> {
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
  }

  // Helper functions
  const getField = (f: any) => Array.isArray(f) ? f[0] : f || '';
  
  const getFilePath = (file: any) => {
    if (!file || Array.isArray(file)) return '';
    return (file.filepath || file.path) ?? '';
  };
  
  const getFilePaths = (fileOrArr: any): string[] => {
    if (!fileOrArr) return [];
    if (Array.isArray(fileOrArr)) return fileOrArr.map(getFilePath).filter(Boolean);
    const single = getFilePath(fileOrArr);
    return single ? [single] : [];
  };

  const validateFileType = (file: any, fileName: string): boolean => {
    const ext = path.extname(fileName).toLowerCase();
    const mimeType = file.mimetype || '';
    return ALLOWED_FILE_TYPES.includes(ext) && ALLOWED_MIME_TYPES.includes(mimeType);
  };

  const validateAndCleanupFile = (file: any, maxSize: number, fileType: string) => {
    if (!file || Array.isArray(file)) return null;
    
    if (file.size > maxSize) {
      const filePath = getFilePath(file);
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error(`${fileType} file is too large (max ${Math.round(maxSize / (1024 * 1024))}MB)`);
    }
    
    if (!validateFileType(file, file.originalFilename || file.name || '')) {
      const filePath = getFilePath(file);
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error(`${fileType} file type not allowed. Only PDF, DOC, and DOCX files are accepted.`);
    }
    
    return file;
  };

  try {
    const { fields, files } = await parseForm(req);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'gender', 'dob', 'nationality', 'position'];
    for (const field of requiredFields) {
      if (!getField(fields[field])) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate email format
    const email = getField(fields.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate date of birth
    const dobString = getField(fields.dob);
    const dob = new Date(dobString);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 10) {
      return res.status(400).json({ error: 'Applicant must be at least 10 years old' });
    }

    // Validate CV is required
    if (!files.cv) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    // Validate cover letter (text or file required)
    const coverLetterText = getField(fields.coverLetter);
    const coverLetterFile = files.coverLetterFile;
    if (!coverLetterText && !coverLetterFile) {
      return res.status(400).json({ error: 'Cover letter (text or file) is required' });
    }

    // Validate and process files
    const cvFile = validateAndCleanupFile(files.cv, MAX_CV_SIZE, 'CV');
    const processedCoverLetterFile = coverLetterFile ? 
      validateAndCleanupFile(coverLetterFile, MAX_COVER_LETTER_SIZE, 'Cover letter') : null;

    // Validate recommendation letters (max 3)
    const recommendationLetters = files.recommendationLetters;
    let processedRecommendationFiles: any[] = [];
    if (recommendationLetters) {
      const recFiles = Array.isArray(recommendationLetters) ? recommendationLetters : [recommendationLetters];
      if (recFiles.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 recommendation letters allowed' });
      }
      
      for (const rec of recFiles) {
        if (rec && rec.size > 0) { // Only process non-empty files
          processedRecommendationFiles.push(
            validateAndCleanupFile(rec, MAX_RECOMMENDATION_SIZE, 'Recommendation letter')
          );
        }
      }
    }

    // Validate certificates (max 5)
    const certificates = files.certificates;
    let processedCertificateFiles: any[] = [];
    if (certificates) {
      const certFiles = Array.isArray(certificates) ? certificates : [certificates];
      if (certFiles.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 certificates allowed' });
      }
      
      for (const cert of certFiles) {
        if (cert && cert.size > 0) { // Only process non-empty files
          processedCertificateFiles.push(
            validateAndCleanupFile(cert, MAX_CERTIFICATE_SIZE, 'Certificate')
          );
        }
      }
    }

    // Get file paths
    const cvPath = getFilePath(cvFile);
    const coverLetterFilePath = getFilePath(processedCoverLetterFile);
    const recommendationLetterPaths = processedRecommendationFiles.map(getFilePath).filter(Boolean);
    const certificatePaths = processedCertificateFiles.map(getFilePath).filter(Boolean);

    // Save to database
    const application = await prisma.application.create({
      data: {
        name: getField(fields.name),
        email: getField(fields.email),
        position: getField(fields.position),
        gender: getField(fields.gender),
        dob: new Date(dobString),
        nationality: getField(fields.nationality),
        coverLetter: coverLetterText,
        cvPath,
        coverLetterFilePath: coverLetterFilePath || '',
        recommendationLetterPaths: JSON.stringify(recommendationLetterPaths), // Convert array to JSON string
        certificatePaths: JSON.stringify(certificatePaths), // Convert array to JSON string
      },
    });

    return res.status(200).json({ 
      success: true, 
      application: {
        id: application.id,
        name: application.name,
        email: application.email,
        position: application.position,
        createdAt: application.createdAt
      }
    });
  } catch (err: any) {
    console.error('Application error:', err);
    return res.status(500).json({ error: err.message || 'Failed to process application' });
  }
}
