import { AuthHumancodeBindAddressDto } from './auth-bind-address-body.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthHumancodeMiniLoginQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  initData: string;
}