import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { services } from '../services.enum';

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
        ClientsModule.register([
            {
                name: services.logger,
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'logger',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule {}
