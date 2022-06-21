import { Controller, Inject, UseInterceptors, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserConfirmDto } from './dto/user-confirm.dto';
import { MailService } from './mail.service';
import { JsonPipe } from './pipes/json.pipe';
import { ValidationPipe } from './pipes/validation.pipe';
import { IRes } from './interfaces/IRes';
import { JsonInterceptor } from './interceptors/json.interceptor';

@Controller()
@UsePipes(new JsonPipe(), new ValidationPipe())
@UseInterceptors(new JsonInterceptor())
export class MailController {
    constructor(
        @Inject(MailService) private readonly mailService: MailService,
    ) {}

    @MessagePattern('sendConfirmCode')
    public async sendConfirmCode(
        @Payload() userConfirm: UserConfirmDto,
    ): Promise<IRes> {
        return await this.mailService.sendConfirmCode(userConfirm);
    }
}
