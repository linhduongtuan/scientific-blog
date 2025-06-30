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
fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // We'll handle file size validation per file below, so set a high maxFileSize
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

  try {
    const { fields, files } = await parseForm(req);
    // Helper to get first value if array, else string
    const getField = (f: any) => Array.isArray(f) ? f[0] : f || '';
    // File size limits (bytes)
    const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_COVER_LETTER_SIZE = 3 * 1024 * 1024; // 3MB
    const MAX_RECOMMENDATION_SIZE = 3 * 1024 * 1024; // 3MB each
    const MAX_CERTIFICATE_SIZE = 3 * 1024 * 1024; // 3MB each

    // Helper to get file path or empty string
    const getFilePath = (file: any) => file && !Array.isArray(file) ? (file.filepath || file.path) ?? '' : '';
    // Helper to get array of file paths
    const getFilePaths = (fileOrArr: any) => {
      if (!fileOrArr) return [];
      if (Array.isArray(fileOrArr)) return fileOrArr.map(getFilePath).filter(Boolean);
      const single = getFilePath(fileOrArr);
      return single ? [single] : [];
    };

    // Validate file sizes
    const cvFile = files.cv as any;
    if (cvFile && !Array.isArray(cvFile) && cvFile.size > MAX_CV_SIZE) {
      fs.unlinkSync(getFilePath(cvFile));
      return res.status(400).json({ error: 'CV file is too large (max 5MB)' });
    }
    const coverLetterFile = files.coverLetterFile as any;
    if (coverLetterFile && !Array.isArray(coverLetterFile) && coverLetterFile.size > MAX_COVER_LETTER_SIZE) {
      fs.unlinkSync(getFilePath(coverLetterFile));
      return res.status(400).json({ error: 'Cover letter file is too large (max 3MB)' });
    }
    const recommendationLetters = files.recommendationLetters as any;
    if (recommendationLetters) {
      const recFiles = Array.isArray(recommendationLetters) ? recommendationLetters : [recommendationLetters];
      for (const rec of recFiles) {
        if (rec.size > MAX_RECOMMENDATION_SIZE) {
          fs.unlinkSync(getFilePath(rec));
          return res.status(400).json({ error: 'Each recommendation letter must be under 3MB' });
        }
      }
    }
    const certificates = files.certificates as any;
    if (certificates) {
      const certFiles = Array.isArray(certificates) ? certificates : [certificates];
      for (const cert of certFiles) {
        if (cert.size > MAX_CERTIFICATE_SIZE) {
          fs.unlinkSync(getFilePath(cert));
          return res.status(400).json({ error: 'Each certificate must be under 3MB' });
        }
      }
    }

    // Save file paths
    const cvPath = getFilePath(cvFile);
    const coverLetterFilePath = getFilePath(coverLetterFile);
    const recommendationLetterPaths = getFilePaths(recommendationLetters);
    const certificatePaths = getFilePaths(certificates);

    // Save to DB (add new fields as needed)
    const application = await prisma.application.create({
      data: {
        name: getField(fields.name),
        email: getField(fields.email),
        position: getField(fields.position),
        gender: getField(fields.gender),
        dob: getField(fields.dob),
        nationality: getField(fields.nationality),
        coverLetter: getField(fields.coverLetter),
        cvPath,
        coverLetterFilePath,
        recommendationLetterPaths,
        certificatePaths,
      },
    });
    return res.status(200).json({ success: true, application });
  } catch (err) {
    console.error('Application error:', err);
    return res.status(500).json({ error: 'Failed to process application' });
  }
}
