import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/entities';
import { NotificationSqlRaw } from './interfaces';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, user: User) {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      userId: user.id,
    });

    await this.notificationRepository.save(notification);

    return notification;
  }

  async findAll() {
    // It's just a practice with a raw query, in a random table
    // purposely use users instead of notifications
    const queryRaw: NotificationSqlRaw[] = await this.dataSource.query(
      'SELECT * FROM users ORDER BY id DESC LIMIT 3',
    );
    const managerQueryRaw: NotificationSqlRaw[] =
      await this.dataSource.manager.query(
        'SELECT * FROM users ORDER BY id DESC LIMIT 4',
      );
    return { queryRaw, managerQueryRaw };
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
