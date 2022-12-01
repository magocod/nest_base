import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities';
import { Repository } from 'typeorm';
import { User } from '../auth/entities';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, user: User) {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      userId: user.id,
    });

    await this.notificationRepository.save(notification);

    return notification;
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
