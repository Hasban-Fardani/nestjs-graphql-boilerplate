import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { User } from '@prisma/client';
import { SentMessageInfo } from 'nodemailer';
import { EmailObject } from './types/email-object.type';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserEmail(
      user: string | EmailObject, 
      template: string, 
      from: string, 
      subject: string, 
      context: any
    ): Promise<SentMessageInfo> {
      try {
        const email = typeof user === 'string' ? user : user.email;

        // send email to user
        const res = await this.mailerService.sendMail({
          to: email,
          from: from,
          subject: subject,
          template: template,
          context: context
        });

        console.log('send email: ', res)
        return true
      } catch (error) {
        console.log('error send email:', error);
        return false
      }
  }

  async sendUserConfirmation(
    user: UserEntity | User, 
    token: string
  ): Promise<SentMessageInfo> {
    const url = `example.com/auth/confirm?token=${token}`;

    const context: any = { 
      name: user.email,
      url: url, 
    }

    return await this.sendUserEmail(
      user, 
      './confirmation', 
      'support@example.com', 
      'Welcome to Nice App! Confirm your Email', 
      context 
    )
  }
}
