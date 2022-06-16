import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const host =
                    process.env.SMTP_HOST || configService.get('smtp.host');
                const secure =
                    process.env.SMTP_SECURE === 'true' ||
                    (process.env.SMTP_SECURE === undefined &&
                        configService.get('smtp.secure'));
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
        LoggerModule,
    ],
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule {}
