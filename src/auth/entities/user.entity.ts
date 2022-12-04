import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';
import { Notification } from '../../notifications/entities';
import { USER_TABLE } from '../auth.constants';

@Entity(USER_TABLE)
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty()
  @Column('text')
  fullName: string;

  @ApiProperty()
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  // FIXME move to bd relation
  @ApiProperty()
  @Column('text', {
    array: true,
    default: ['user'],
  })
  rolesStr: string[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiProperty()
  @ManyToMany(() => Role, (role: Role) => role.users)
  @JoinTable()
  roles!: Role[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @BeforeInsert()
  // @BeforeUpdate() // error update
  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
