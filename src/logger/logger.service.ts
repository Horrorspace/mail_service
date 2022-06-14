import { Injectable, LoggerService as ILogger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { logs } from './enums/logs.enum';
import { services } from '../services.enum';

type log = `${logs}`;

@Injectable()
export class LoggerService implements ILogger {
    constructor(
        @Inject(services.logger) private readonly logger: ClientProxy,
    ) {}

    private _log(level: log, message: string): void {
        try {
            this.logger.send(level, message).subscribe();
        } catch (e) {
            console.error(e);
        }
    }

    public log(message: string): void {
        console.info(message);
        const level = logs.info;
        this._log(level, message);
    }

    public error(message: string): void {
        console.error(message);
        const level = logs.info;
        this._log(level, message);
    }

    public warn(message: string): void {
        console.warn(message);
        const level = logs.info;
        this._log(level, message);
    }

    public debug(message: string): void {
        console.debug(message);
        const level = logs.info;
        this._log(level, message);
    }
}
