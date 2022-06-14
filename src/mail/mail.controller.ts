import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserConfirmDto } from './dto/user-confirm.dto';
import { MailService } from './mail.service';
import { JsonPipe } from './pipes/json.pipe';
import { IRes } from './interfaces/IRes';

@Controller()
export class MailController {
    constructor(
        @Inject(MailService) private readonly mailService: MailService,
    ) {}

    @MessagePattern('sendConfirmCode')
    public async sendConfirmCode(
        @Payload(new JsonPipe()) userConfirm: UserConfirmDto,
    ): Promise<IRes> {
        return await this.mailService.sendConfirmCode(userConfirm);
    }
}
