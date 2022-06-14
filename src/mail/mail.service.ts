import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';
import { UserConfirmDto } from './dto/user-confirm.dto';
import { IRes } from './interfaces/IRes';
import { codes } from './enums/codes.enum';
import { statuses } from './enums/statuses.enum';
import { IError } from './interfaces/IError';

@Injectable()
export class MailService {
    constructor(
        @Inject(MailerService) private readonly mailerService: MailerService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {}

    public async sendConfirmCode({
        email,
        code,
    }: UserConfirmDto): Promise<IRes> {
        try {
            const user =
                process.env.SMTP_USER || this.configService.get('smtp.user');
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
            const error: IError = {
                code: codes.serverErr,
                reason: `${e}`,
            };
            throw new RpcException(error);
        }
    }
}
