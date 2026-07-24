-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('BAN', 'UNBAN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activeStatus" "ActiveStatus" NOT NULL DEFAULT 'UNBAN';
