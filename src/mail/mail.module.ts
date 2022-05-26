import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const secure = process.env.SMTP_SECURE || true;
const protocol = secure ? 'smtps' : 'smtp';
const user = process.env.SMTP_USER || 'qwefgklasm@gmail.com';
const password = process.env.SMTP_PASSWORD || 'LOMzXtWT';
const transport = `${protocol}://${user}:${password}@${host}`;

@Module({
    imports: [
        MailerModule.forRoot({
            transport,
            defaults: {
                from: user,
            },
        }),
    ],
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule {}
