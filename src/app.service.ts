import { Injectable } from '@nestjs/common';
import aqp from 'api-query-params';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Tuan';
  }
}
