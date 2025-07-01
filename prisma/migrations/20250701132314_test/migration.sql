/*
  Warnings:

  - You are about to drop the column `certificatePaths` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetterFilePath` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationLetterPaths` on the `Application` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "cvPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Application" ("coverLetter", "createdAt", "cvPath", "email", "id", "name", "position") SELECT "coverLetter", "createdAt", "cvPath", "email", "id", "name", "position" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
