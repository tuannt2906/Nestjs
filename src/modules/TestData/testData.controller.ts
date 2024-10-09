import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { TestDataService } from './testData.service';
import { ResponseData } from 'modules/global/globalClass';
import {
  HttpMessage,
  HttpStatus as GlobalHttpStatus,
} from 'modules/global/globalEnum';

@Controller('test-data')
export class TestDataController {
  constructor(private readonly testDataService: TestDataService) {}

  @Get()
  async getTestData(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ResponseData<{ data: any[]; total: number; currentPage: number; totalPages: number }>> {
    try {
      const { data, total } = await this.testDataService.getTestDataWithPagination(page, limit);
      const totalPages = Math.ceil(total / limit);

      return new ResponseData<{ data: any[]; total: number; currentPage: number; totalPages: number }>(
        {
          data,
          total,
          currentPage: page,
          totalPages,
        },
        GlobalHttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      throw new HttpException(
        new ResponseData<any[]>(
          null,
          GlobalHttpStatus.INTERNAL_SERVER_ERROR,
          HttpMessage.INTERNAL_SERVER_ERROR,
        ),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
