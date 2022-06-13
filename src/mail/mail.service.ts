import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { UserConfirmDto } from './dto/user-confirm.dto';
import { IRes } from './interfaces/IRes';
import { services } from '../services.enum';

const user = process.env.SMTP_USER || 'qwefgklasm@gmail.com';

@Injectable()
export class MailService {
    constructor(
        @Inject(MailerService) private readonly mailerService: MailerService,
        @Inject(services.logger) private readonly clinet: ClientProxy,
    ) {
        setInterval(() => {
            this.clinet.send('info', 'test').subscribe({
                next: (val) => console.log(val)
            });
            console.log('send');
        }, 10000)
    }

    public async sendConfirmCode({
        email,
        code,
    }: UserConfirmDto): Promise<IRes> {
        try {
            await this.mailerService.sendMail({
                to: email,
                from: user,
                subject: 'Confirmation code',
                text: code,
            });
            return {
                status: 'success',
                message: '',
            };
        } catch (e) {
            throw new RpcException('500');
        }
    }
}
