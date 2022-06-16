import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { MailExceptionFilter } from './mail/filters/mail-exception.filter';
import { JsonInterceptor } from './mail/interceptors/json.interceptor';

export async function getOptions(): Promise<RmqOptions> {
    const module = await NestFactory.create(AppModule);
    const configService = module.get(ConfigService);
    const protocol =
        process.env.RABBITMQ_PROTOCOL || configService.get('rabbitmq.protocol');
    const host =
        process.env.RABBITMQ_HOST || configService.get('rabbitmq.host');
    const port =
        process.env.RABBITMQ_PORT || configService.get('rabbitmq.port');
    const user =
        process.env.RABBITMQ_USER || configService.get('rabbitmq.user');
    const password =
        process.env.RABBITMQ_PASSWORD || configService.get('rabbitmq.password');
    const durable =
        process.env.RABBITMQ_DURABLE === 'true' ||
        (process.env.RABBITMQ_DURABLE === undefined &&
            configService.get('rabbitmq.durable'));
    const queue =
        process.env.MAIL_SERVICE_QUEUE ||
        configService.get('mail_service.queue');
    const url = `${protocol}://${user}:${password}@${host}:${port}`;
    const options: RmqOptions = {
        transport: Transport.RMQ,
        options: {
            urls: [url],
            queue,
            queueOptions: {
                durable,
            },
        },
    };
    return options;
}

async function bootstrap() {
    const options = await getOptions();
    const app = await NestFactory.createMicroservice<RmqOptions>(
        AppModule,
        options,
    );
    const logger = app.get(LoggerService);
    app.useLogger(logger);
    app.useGlobalFilters(new MailExceptionFilter(logger));
    app.useGlobalInterceptors(new JsonInterceptor());
    app.listen();
}
bootstrap();
