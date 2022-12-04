import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PermissionCreate1664660241262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'text',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'bool',
            isNullable: false,
            default: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions');
  }
}
