import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';
import { options } from '../src/main';
import { Observable } from 'rxjs';
import { IRes } from 'src/mail/interfaces/IRes';

describe('AppController (e2e)', () => {
    let app: INestMicroservice;
    let client: ClientProxy;
    const mailService = 'mail_service';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                ClientsModule.register([
                    {
                        name: mailService,
                        transport: Transport.RMQ,
                        options: {
                            urls: ['amqp://localhost:5672'],
                            queue: 'mail',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    },
                ]),
            ],
        }).compile();

        app = moduleFixture.createNestMicroservice(options);
        await app.init();

        client = app.get(mailService);
        await client.connect();
    });
    afterAll(async () => {
        await app.close();
        await client.close();
    });

    it('should return success message', (done) => {
        const response: Observable<string> = client.send(
            'sendConfirmCode',
            JSON.stringify({ email: 'qwefgklasm@gmail.com', code: '111111' }),
        );
        response.subscribe((data) => {
            expect(typeof data).toEqual('string');
            const res = JSON.parse(data) as IRes;
            expect(res.hasOwnProperty('status')).toEqual(true);
            expect(res.hasOwnProperty('message')).toEqual(true);
            expect(res.status).toEqual('success');
            expect(res.message).toEqual('');
            done();
        });
    });
    it('should return error message', (done) => {
        const response: Observable<string> = client.send(
            'sendConfirmCode',
            JSON.stringify({ test: '' }),
        );
        response.subscribe((data) => {
            expect(typeof data).toEqual('string');
            const res = JSON.parse(data) as IRes;
            expect(res.hasOwnProperty('status')).toEqual(true);
            expect(res.hasOwnProperty('message')).toEqual(true);
            expect(res.status).toEqual('error');
            expect(res.message).toEqual('400');
            done();
        });
    });
});
