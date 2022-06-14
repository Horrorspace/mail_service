import { codeRes } from './IErrorRes';

export interface IError {
    code: codeRes;
    reason: string;
}
