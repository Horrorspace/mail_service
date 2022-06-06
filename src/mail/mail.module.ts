import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { services } from '../services.enum';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const host =
                    process.env.SMTP_HOST || configService.get('smtp.host');
                const secure =
                    process.env.SMTP_SECURE || configService.get('smtp.secure');
                const protocol = secure ? 'smtps' : 'smtp';
                const user =
                    process.env.SMTP_USER || configService.get('smtp.user');
                const password =
                    process.env.SMTP_PASSWORD ||
                    configService.get('smtp.password');
                const transport = `${protocol}://${user}:${password}@${host}`;
                return {
                    transport,
                    defaults: {
                        from: user,
                    },
                };
            },
        }),
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: services.logger,
                useFactory: async (configService: ConfigService) => {
                    const host =
                        process.env.RABBITMQ_HOST ||
                        configService.get('rabbitmq.host');
                    const protocol =
                        process.env.RABBITMQ_PROTOCOL ||
                        configService.get('rabbitmq.protocol');
                    const port =
                        process.env.RABBITMQ_PORT ||
                        configService.get('rabbitmq.port');
                    const user =
                        process.env.RABBITMQ_USER ||
                        configService.get('rabbitmq.user');
                    const password =
                        process.env.RABBITMQ_PASSWORD ||
                        configService.get('rabbitmq.password');
                    const durable =
                        process.env.RABBITMQ_DURABLE === 'true' ||
                        configService.get('rabbitmq.durable');
                    const queue =
                        process.env.LOGGER_SERVICE_QUEUE ||
                        configService.get('logger_service.queue');
                    const url = `${protocol}://${user}:${password}@${host}${port}`;
                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [url],
                            queue,
                            queueOptions: {
                                durable,
                            },
                        },
                    };
                },
            },
        ]),
    ],
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule {}
