import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { UserConfirmDto } from './dto/user-confirm.dto';
import { IRes } from './interfaces/IRes';
import { services } from '../services.enum';
import { codes } from './enums/codes.enum';
import { statuses } from './enums/statuses.enum';
import { logs } from './enums/logs.enum';

const user = process.env.SMTP_USER || 'qwefgklasm@gmail.com';

@Injectable()
export class MailService {
    constructor(
        @Inject(MailerService) private readonly mailerService: MailerService,
        @Inject(services.logger) private readonly logger: ClientProxy,
    ) {}

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
                status: statuses.success,
                message: '',
            };
        } catch (e) {
            this.logger.send(logs.error, `${e}`).subscribe();
            throw new RpcException(codes.serverErr);
        }
    }
}
