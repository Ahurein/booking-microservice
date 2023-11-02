import { IsString, IsStrongPassword } from "class-validator"
import { string } from "joi"

export class CreateUserDto {
    @IsString()
    email: string

    @IsStrongPassword()
    password: string
}