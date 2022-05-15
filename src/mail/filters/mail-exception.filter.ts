import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { IRes } from '../interfaces/IRes';

@Catch(RpcException)
export class MailExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const message = exception.getError() as string;
        const res: IRes = {
            message,
            status: 'error'
        };
        const resStr = JSON.stringify(res);
        return of(resStr);
    }
}