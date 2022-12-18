import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities';
import { NOTIFICATION_TABLE } from '../notifications.contants';
import { Topic } from './topic.entity';

@Entity({ name: NOTIFICATION_TABLE })
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column('text')
  title!: string;

  @ApiProperty()
  @Column('text', { default: '' })
  description!: string;

  @ApiProperty()
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty()
  @Column('int')
  userId!: number;

  @ApiProperty()
  @Column('int')
  topicId!: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Topic, (topic) => topic.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topicId' })
  topic!: Topic;
}
