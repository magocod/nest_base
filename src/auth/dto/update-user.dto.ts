import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, AdminCreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class AdminUpdateUserDto extends PartialType(AdminCreateUserDto) {}
