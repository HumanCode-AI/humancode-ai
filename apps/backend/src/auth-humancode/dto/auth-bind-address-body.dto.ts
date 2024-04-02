import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthHumancodeBindAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  address: string;
}