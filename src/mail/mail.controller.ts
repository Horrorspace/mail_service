import {
    Controller,
    Inject,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserConfirmDto } from './dto/user-confirm.dto';
import { MailService } from './mail.service';
import { MailExceptionFilter } from './filters/mail-exception.filter';
import { JsonPipe } from './pipes/json.pipe';
import { IRes } from './interfaces/IRes';
import { JsonInterceptor } from './interceptors/json.interceptor';

@Controller()
export class MailController {
    constructor(
        @Inject(MailService) private readonly mailService: MailService,
    ) {}

    @MessagePattern('sendConfirmCode')
    @UseFilters(new MailExceptionFilter())
    @UseInterceptors(JsonInterceptor)
    public async sendConfirmCode(
        @Payload(new JsonPipe()) userConfirm: UserConfirmDto,
    ): Promise<IRes> {
        return await this.mailService.sendConfirmCode(userConfirm);
    }
}
