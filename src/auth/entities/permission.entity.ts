import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  // JoinTable,
} from 'typeorm';

import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
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

  @ManyToMany(() => Role, (role: Role) => role.permissions)
  // @JoinTable()
  roles!: Role[];
}
