import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { IErrorRes } from '../interfaces/IErrorRes';
import { IError } from '../interfaces/IError';
import { statuses } from '../enums/statuses.enum';
import { LoggerService } from '../../logger/logger.service';

@Catch(RpcException)
export class MailExceptionFilter implements RpcExceptionFilter<RpcException> {
    constructor(private readonly loggerService: LoggerService) {}

    public catch(exception: RpcException): Observable<any> {
        const error = exception.getError() as IError;
        const message = error.code;
        const res: IErrorRes = {
            message,
            status: statuses.error,
        };
        const resStr = JSON.stringify(res);
        const errStr = `mail_service: ${error.reason}`;
        this.loggerService.error(errStr);
        return of(resStr);
    }
}
