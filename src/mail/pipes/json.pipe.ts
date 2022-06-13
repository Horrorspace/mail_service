import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserConfirmDto } from '../dto/user-confirm.dto';
import { codes } from '../enums/codes.enum';

@Injectable()
export class JsonPipe implements PipeTransform {
    public transform(value: any): UserConfirmDto {
        if (typeof value === 'string') {
            const data = JSON.parse(value) as UserConfirmDto;
            if (!data.hasOwnProperty('email')) {
                throw new RpcException(codes.badRequest);
            }
            if (!data.hasOwnProperty('code')) {
                throw new RpcException(codes.badRequest);
            }
            if (typeof data.email !== 'string') {
                throw new RpcException(codes.badRequest);
            }
            if (typeof data.code !== 'string') {
                throw new RpcException(codes.badRequest);
            }
            return data;
        } else throw new RpcException(codes.badRequest);
    }
}
