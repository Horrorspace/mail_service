import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRes } from '../interfaces/IRes';

@Injectable()
export class JsonInterceptor implements NestInterceptor<IRes, string> {
    public intercept(
        context: ExecutionContext,
        next: CallHandler<IRes>,
    ): Observable<string> | Promise<Observable<string>> {
        return next.handle().pipe(map((res) => JSON.stringify(res)));
    }
}
