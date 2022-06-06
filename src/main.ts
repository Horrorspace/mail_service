import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { AppModule } from './app.module';

async function bootstrap() {
    const module = await NestFactory.create(AppModule);
    const configService = module.get(ConfigService);
    const host =
        process.env.RABBITMQ_HOST || configService.get('rabbitmq.host');
    const protocol =
        process.env.RABBITMQ_PROTOCOL || configService.get('rabbitmq.protocol');
    const port =
        process.env.RABBITMQ_PORT || configService.get('rabbitmq.port');
    const user =
        process.env.RABBITMQ_USER || configService.get('rabbitmq.user');
    const password =
        process.env.RABBITMQ_PASSWORD || configService.get('rabbitmq.password');
    const durable =
        process.env.RABBITMQ_DURABLE === 'true' ||
        configService.get('rabbitmq.durable');
    const queue =
        process.env.LOGGER_SERVICE_QUEUE ||
        configService.get('mail_service.queue');
    const url = `${protocol}://${user}:${password}@${host}${port}`;
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
    const app = await NestFactory.createMicroservice<RmqOptions>(
        AppModule,
        options,
    );
    app.listen();
}
bootstrap();
