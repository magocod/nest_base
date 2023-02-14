import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  POST_CATEGORY_VIEW_EXP,
  POST_CATEGORY_VIEW_NAME,
} from '../views/views';

export class PostCategoryView1676401462376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE VIEW ${POST_CATEGORY_VIEW_NAME} AS ${POST_CATEGORY_VIEW_EXP}`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW [IF EXISTS] ${POST_CATEGORY_VIEW_NAME}`);
  }
}
