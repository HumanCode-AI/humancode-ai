import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export default class FaucetTakeBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  initData: string;
}