-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academicTitle" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "className" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lecturerCode" TEXT,
ADD COLUMN     "studentCode" TEXT;
