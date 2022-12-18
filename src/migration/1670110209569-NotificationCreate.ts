import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import {
  NOTIFICATION_TABLE,
  TOPIC_TABLE,
} from '../notifications/notifications.contants';
import { USER_TABLE } from '../auth/auth.constants';

export class NotificationCreate1670110209569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: NOTIFICATION_TABLE,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'text',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
            default: "''",
          },
          {
            name: 'isActive',
            type: 'bool',
            isNullable: false,
            default: true,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'topicId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            // type: "timestamp",
            // type: 'timestamp with time zone', // pg only
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            // type: "timestamp",
            // type: 'timestamp with time zone', // pg only
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      NOTIFICATION_TABLE,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: USER_TABLE,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      NOTIFICATION_TABLE,
      new TableForeignKey({
        columnNames: ['topicId'],
        referencedColumnNames: ['id'],
        referencedTableName: TOPIC_TABLE,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(NOTIFICATION_TABLE);
  }
}
