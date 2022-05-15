import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { AppModule } from './app.module';

export const options: RmqOptions = {
    transport: Transport.RMQ,
    options: {
        urls: ['amqp://localhost:5672'],
        queue: 'mail',
        queueOptions: {
            durable: true,
        },
    },
};

async function bootstrap() {
    const app = await NestFactory.createMicroservice<RmqOptions>(
        AppModule,
        options,
    );
    app.listen();
}
bootstrap();
