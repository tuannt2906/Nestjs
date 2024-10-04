import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendActivationEmail(email: string, username: string, activationCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your account',
      template: 'mailer.hbs',
      context: {
        name: username || email,
        activationCode,
      },
    });
  }
}