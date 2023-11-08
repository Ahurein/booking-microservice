import { IsArray, IsNotEmpty, IsOptional, IsString, IsStrongPassword, isNotEmpty } from "class-validator"

export class CreateUserDto {
    @IsString()
    email: string

    @IsStrongPassword({})
    password: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    roles?: string[]
}