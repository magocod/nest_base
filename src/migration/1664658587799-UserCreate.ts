import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserCreate1664658587799 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'text',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'fullName',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'bool',
            isNullable: false,
            default: true,
          },
          // FIXME move to bd relation
          {
            name: 'rolesStr',
            type: 'text',
            isNullable: false,
            isArray: true,
            default: "'{user}'::text[]",
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
    await queryRunner.dropTable('users');
  }
}
