import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TOPIC_TABLE } from '../notifications.contants';
import { Notification } from './notification.entity';

@Entity({ name: TOPIC_TABLE })
export class Topic {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column('text', { nullable: false })
  name!: string;

  @ApiProperty()
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Notification, (notification) => notification.topic, {
    onDelete: 'CASCADE',
  })
  notifications!: Notification;
}
