import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class AudioTranscodeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  file?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  log?: boolean;
}
