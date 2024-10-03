-- AlterTable
ALTER TABLE `users` ADD COLUMN `codeExpired` DATETIME(3) NULL,
    ADD COLUMN `codeId` VARCHAR(191) NULL;
