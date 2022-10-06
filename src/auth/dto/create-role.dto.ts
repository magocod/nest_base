import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name;

  @IsString()
  description;

  @IsBoolean()
  @IsOptional()
  isActive?;

  @IsInt({ each: true })
  @IsOptional()
  permissions?;
}
