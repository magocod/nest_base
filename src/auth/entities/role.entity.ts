import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @Column('text')
  description!: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(() => Permission, (permission: Permission) => permission.roles)
  @JoinTable()
  permissions!: Permission[];

  @ManyToMany(() => User, (user: User) => user.roles)
  // @JoinTable()
  users!: User[];
}
