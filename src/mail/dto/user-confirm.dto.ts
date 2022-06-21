import { IsEmail, IsString } from 'class-validator';

export class UserConfirmDto {
    @IsEmail()
    public readonly email: string;

    @IsString()
    public readonly code: string;
}
