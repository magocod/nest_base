import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';

// example generate -> typeorm migration:create ./src/migration/UserCreate
import { UserCreate1664658587799 } from './migration/1664658587799-UserCreate';
import { RoleCreate1664660233196 } from './migration/1664660233196-RoleCreate';
import { PermissionCreate1664660241262 } from './migration/1664660241262-PermissionCreate';
import { UsersRolesCreate1664660368705 } from './migration/1664660368705-UsersRolesCreate';
import { RolesPermissionsCreate1664660378482 } from './migration/1664660378482-RolesPermissionsCreate';
import { NotificationCreate1670110209569 } from './migration/1670110209569-NotificationCreate';
import { TopicCreate1670110209568 } from './migration/1670110209568-TopicCreate';

// const entitiesPath =
//   process.env.NODE_ENV === "testing"
//     ? "src/entity/**/*.ts"
//     : "dist/entity/**/*.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
  entities: [],
  // remove index, on migration, problem importing files
  // migrations: ['dist/migration/**/*.js'],
  migrations: [
    UserCreate1664658587799,
    RoleCreate1664660233196,
    PermissionCreate1664660241262,
    UsersRolesCreate1664660368705,
    RolesPermissionsCreate1664660378482,
    NotificationCreate1670110209569,
    TopicCreate1670110209568,
  ],
  // migrations,
  subscribers: [],
});
