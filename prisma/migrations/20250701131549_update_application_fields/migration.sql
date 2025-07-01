-- Add missing fields to Application table
ALTER TABLE "Application" ADD COLUMN "gender" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN "dob" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Application" ADD COLUMN "nationality" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Application" ADD COLUMN "coverLetterFilePath" TEXT;
ALTER TABLE "Application" ADD COLUMN "recommendationLetterPaths" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Application" ADD COLUMN "certificatePaths" TEXT NOT NULL DEFAULT '[]';