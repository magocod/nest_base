import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  text: string;

  @IsString()
  @IsOptional()
  meta: string;

  @IsInt()
  @IsOptional()
  sql_user_id: number;
}
