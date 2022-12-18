import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities';
import { In, Repository } from 'typeorm';
import { Permission, User } from '../auth/entities';

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

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification)
      throw new NotFoundException(`Notification with ${id} not found`);

    return notification;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.preload({
      id,
      ...updateNotificationDto,
    });
    if (!notification)
      throw new NotFoundException(`Notification with id: ${id} not found`);

    await this.notificationRepository.save(notification);

    return notification;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
