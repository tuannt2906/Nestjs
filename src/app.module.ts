import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'modules/users/user.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
