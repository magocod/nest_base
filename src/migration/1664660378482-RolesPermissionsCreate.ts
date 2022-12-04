import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class RolesPermissionsCreate1664660378482 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles_permissions_permissions',
        columns: [
          // migrations by typeorm, no id field as primary key, primary key is a combination of columns
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'rolesId',
            type: 'int',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'permissionsId',
            type: 'int',
            isUnique: false,
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
      'roles_permissions_permissions',
      new TableForeignKey({
        columnNames: ['rolesId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'roles_permissions_permissions',
      new TableForeignKey({
        columnNames: ['permissionsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles_permissions_permissions');
  }
}
