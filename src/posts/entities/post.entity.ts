import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table
export class Post extends Model<
  InferAttributes<Post>,
  InferCreationAttributes<Post>
> {
  @AllowNull(false)
  @Column(DataType.TEXT)
  title: string;

  @AllowNull(false)
  @Column({ defaultValue: true, type: DataType.BOOLEAN })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
