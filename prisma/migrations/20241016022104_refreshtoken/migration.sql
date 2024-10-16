-- AlterTable
ALTER TABLE `users` ADD COLUMN `refreshTokenExpired` DATETIME(3) NULL,
    MODIFY `codeId` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL;
