import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: 'user@mail.ru', default: 'email'})
    @IsString({message: "Должно быть строкой"})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;
    @ApiProperty({example: '12345', default: 'password'})
    @IsString({message: "Должно быть строкой"})
    @Length(4, 16, {message: "Не меньше 4 и не больше 16 символов"})
    readonly password: string;
}