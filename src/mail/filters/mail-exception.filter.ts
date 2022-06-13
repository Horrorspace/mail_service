import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { IErrorRes, codeRes } from '../interfaces/IErrorRes';
import { statuses } from '../enums/statuses.enum';

@Catch(RpcException)
export class MailExceptionFilter implements RpcExceptionFilter<RpcException> {
    public catch(exception: RpcException): Observable<any> {
        const message = exception.getError() as codeRes;
        const res: IErrorRes = {
            message,
            status: statuses.error,
        };
        const resStr = JSON.stringify(res);
        return of(resStr);
    }
}
