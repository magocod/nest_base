import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { Auth, GetUser, PermissionProtected, RawHeaders } from './decorators';

import { CreateUserDto, LoginUserDto, RecoveryPasswordDto } from './dto';
import { User } from './entities';

import { UserPermissionGuard } from './guards';
import { PermissionNames } from './interfaces';
import { ApiVersion } from '../app.constants';

@ApiTags('Auth')
@Controller({ path: 'auth', version: ApiVersion.v1 })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @PermissionProtected(PermissionNames.EXAMPLE, PermissionNames.USER)
  @UseGuards(AuthGuard(), UserPermissionGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(PermissionNames.EXAMPLE)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Post('email_recovery_password')
  sendEmailRecoverPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.authService.sendEmailRecoverPassword(recoveryPasswordDto);
  }
}
