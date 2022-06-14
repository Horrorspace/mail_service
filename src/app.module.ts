import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import configuration from './config/configuration';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [configuration],
        }),
        MailModule,
        LoggerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
