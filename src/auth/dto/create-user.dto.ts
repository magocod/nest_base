import {
  IsBoolean,
  IsEmail, IsInt, IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PASSWORD_PATTERN } from '../constants';

// public registration
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  fullName: string;
}

// admin registration
export class AdminCreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty()
  @IsInt({ each: true })
  @IsOptional()
  roles?: number[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
