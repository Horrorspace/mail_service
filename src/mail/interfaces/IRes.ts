type status = 'success' | 'error';

export interface IRes {
    status: status;
    message: string;
}