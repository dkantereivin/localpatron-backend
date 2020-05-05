import {IsAlpha, IsAscii, IsEmail, Length} from 'class-validator';

export class ContactFormDto {
    @IsAlpha()
    @Length(2, 32)
    name: string;

    @IsEmail()
    email: string;

    @IsAscii()
    @Length(2, 1500)
    message: string;
}