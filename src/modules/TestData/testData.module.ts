import { Module } from '@nestjs/common';
import { TestDataController } from './testData.controller';
import { TestDataService } from './testData.service';
import { PrismaService } from 'prisma.service';

@Module({
  controllers: [TestDataController],
  providers: [TestDataService, PrismaService],
})
export class TestDataModule {}
