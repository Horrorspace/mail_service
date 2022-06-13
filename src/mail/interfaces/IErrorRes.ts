import { IStatus } from './IStatus';
import { codes } from '../enums/codes.enum';

export type codeRes = `${codes}`;

export interface IErrorRes extends IStatus {
    message: codeRes;
}
