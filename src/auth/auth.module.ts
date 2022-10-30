import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { PermissionsService } from './permissions.service';
import { RolesService } from './roles.service';
import { AuthController } from './auth.controller';
import { PermissionsController } from './permissions.controller';
import { RolesController } from './roles.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Permission, Role, User } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
    // JwtModule.register({
    // secret: process.env.JWT_SECRET,
    // signOptions: {
    //   expiresIn:'2h'
    // }
    // })
  ],
  controllers: [
    AuthController,
    PermissionsController,
    RolesController,
    UsersController,
  ],
  providers: [
    AuthService,
    PermissionsService,
    RolesService,
    JwtStrategy,
    UsersService,
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    UsersService,
  ],
})
export class AuthModule {}
