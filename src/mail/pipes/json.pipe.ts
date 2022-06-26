import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { codes } from '../enums/codes.enum';
import { IError } from '../interfaces/IError';

@Injectable()
export class JsonPipe implements PipeTransform {
    public transform(value: any): object {
        try {
            if (typeof value === 'string') {
                const data = JSON.parse(value) as object;
                return data;
            } else {
                throw 'there is not valid value';
            }
        } catch (e) {
            const error: IError = {
                code: codes.badRequest,
                reason: `${e}`,
            };
            throw new RpcException(error);
        }
    }
}
