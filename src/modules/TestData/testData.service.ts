import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';

@Injectable()
export class TestDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getTestDataWithPagination(
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;1
    const limitNumber = Number(limit);
    const data = await this.prisma.testData.findMany({
      skip,
      take: limitNumber,
      orderBy: {
        date: 'desc',
      },
    });
    const total = await this.prisma.testData.count();
    return { data, total };
  }
}
