import { IsEmail, IsString } from "class-validator";

export class UserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}


export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}