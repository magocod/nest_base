import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name;

  @ApiProperty()
  @IsString()
  description;

  @IsBoolean()
  @IsOptional()
  isActive?;

  @ApiProperty()
  @IsInt({ each: true })
  @IsOptional()
  permissions?;
}
