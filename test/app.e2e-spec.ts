import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';
import { getOptions } from '../src/main';
import { Observable } from 'rxjs';
import { IRes } from 'src/mail/interfaces/IRes';
import { LoggerService } from '../src/logger/logger.service';
import { MailExceptionFilter } from '../src/mail/filters/mail-exception.filter';
import { JsonInterceptor } from '../src/mail/interceptors/json.interceptor';

describe('AppController (e2e)', () => {
    jest.setTimeout(10000);
    let app: INestMicroservice;
    let client: ClientProxy;
    let logger: ClientProxy;
    const mailService = 'mail_service';
    const loggerService = 'logger_service';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                ClientsModule.register([
                    {
                        name: mailService,
                        transport: Transport.RMQ,
                        options: {
                            urls: ['amqp://user:BGNdWquZ@localhost:5672'],
                            queue: 'mail',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    },
                    {
                        name: loggerService,
                        transport: Transport.RMQ,
                        options: {
                            urls: ['amqp://user:BGNdWquZ@localhost:5672'],
                            queue: 'logger',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    },
                ]),
            ],
        }).compile();

        const options = await getOptions();
        app = moduleFixture.createNestMicroservice(options);
        const appLogger = app.get(LoggerService);
        app.useLogger(appLogger);
        app.useGlobalFilters(new MailExceptionFilter(appLogger));
        app.useGlobalInterceptors(new JsonInterceptor());
        await app.init();

        client = app.get(mailService);
        await client.connect();

        logger = app.get(loggerService);
        await logger.connect();
    });
    afterAll(async () => {
        await app.close();
        await client.close();
        await logger.close();
    });

    it('should return success message', (done) => {
        const response: Observable<string> = client.send(
            'sendConfirmCode',
            JSON.stringify({ email: 'horrorspace@mail.ru', code: '111111' }),
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
        const logInfo = () => {
            return new Promise((resolve, reject) => {
                logger.send('info', 'inf').subscribe({
                    next: (data) => resolve(data),
                    error: (err) => reject(err),
                });
            });
        };
        response.subscribe(async (data) => {
            const test = await logInfo();
            console.log(test);
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
