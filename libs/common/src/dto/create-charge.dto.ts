import Stripe from "stripe";
import { CardDto } from "./card-dto";
import { IsDefined, IsNotEmpty, IsNotEmptyObject, ValidateNested, isNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateChargeDto {
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;

    @IsNotEmpty()
    amount: number
}