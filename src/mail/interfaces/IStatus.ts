import { statuses } from '../enums/statuses.enum';

type status = `${statuses}`;

export interface IStatus {
    status: status;
}
