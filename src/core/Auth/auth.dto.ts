import {IsAscii, IsEmail, Length} from 'class-validator';

export class LoginFormDto {
    @IsEmail()
    email: string;

    @Length(8, 128)
    @IsAscii()
    pass: string;
}