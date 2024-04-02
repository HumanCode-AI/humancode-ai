import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

const isBlank = (x: any) => x === undefined || x === null || x === '';

export class AuthHumancodeCallbackDto {
  @ApiProperty()
  @IsNotEmpty()
  session_id: string;

  @ApiProperty()
  @IsNotEmpty()
  vcode: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => (!isBlank ? (Number(value) || -999) : -999))
  error_code: number; 
}
