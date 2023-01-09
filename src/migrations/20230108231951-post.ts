import { QueryInterface } from 'sequelize';

const migration = {
  up: async (
    queryInterface: QueryInterface,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    Sequelize: any,
  ): Promise<void> => {
    await queryInterface.createTable('posts', {
      id: {
        type: 'INTEGER',
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: 'TEXT',
        allowNull: false,
      },
      isActive: {
        type: 'BOOLEAN',
        allowNull: false,
      },
      createdAt: {
        type: 'DATETIME',
        allowNull: true,
      },
      updatedAt: {
        type: 'DATETIME',
        allowNull: true,
      },
    });
  },
  down: async (
    queryInterface: QueryInterface,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    Sequelize: any,
  ): Promise<void> => {
    await queryInterface.dropTable('posts');
  },
};

export = migration;
