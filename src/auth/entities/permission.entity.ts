import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  // JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column('text')
  name!: string;

  @ApiProperty()
  @Column('text')
  description!: string;

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

  @ApiProperty()
  @ManyToMany(() => Role, (role: Role) => role.permissions)
  // @JoinTable()
  roles!: Role[];
}
