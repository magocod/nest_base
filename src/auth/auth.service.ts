import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities';
import { LoginUserDto, CreateUserDto, RecoveryPasswordDto } from './dto';
import { JwtPayload } from './interfaces';
import {
  CREDENTIALS_INVALID_EMAIL,
  CREDENTIALS_INVALID_PASSWORD,
} from './auth.messages';
import { InjectQueue } from '@nestjs/bull';
import {
  EmailJob,
  EmailJobNames,
  EmailQueue,
  emailQueueName,
} from '../mail/mail.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectQueue(emailQueueName) private readonly emailQueue: EmailQueue,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }, //! OJO!
    });

    if (!user) throw new UnauthorizedException(CREDENTIALS_INVALID_EMAIL);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(CREDENTIALS_INVALID_PASSWORD);

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }

  // for testing
  getDataSource(): DataSource {
    return this.dataSource;
  }

  sendEmailRecoverPassword(data: RecoveryPasswordDto): Promise<EmailJob> {
    const url = `http://example.com/auth/confirm?token=abc`;
    return this.emailQueue.add(EmailJobNames.basic, {
      log: true,
      options: {
        to: [data.email],
        subject: 'Recovery password',
        html: `<b>Recovery password</b> <br> <b>url: ${url}</b>`,
      },
    });
  }
}
