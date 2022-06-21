import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserConfirmDto } from '../dto/user-confirm.dto';
import { codes } from '../enums/codes.enum';
import { IError } from '../interfaces/IError';

@Injectable()
export class JsonPipe implements PipeTransform {
    public transform(value: any): UserConfirmDto {
        if (typeof value === 'string') {
            const data = JSON.parse(value) as UserConfirmDto;
            return data;
        } else {
            const error: IError = {
                code: codes.badRequest,
                reason: 'there is not valid value',
            };
            throw new RpcException(error);
        }
    }
}
