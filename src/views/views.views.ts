import { ViewEntity, ViewColumn } from 'typeorm';

export const POST_CATEGORY_VIEW_NAME = 'post_category';
export const POST_CATEGORY_VIEW_EXP = `
        SELECT "post"."id" AS "id", "post"."name" AS "name", "category"."name" AS "categoryName"
        FROM "post" "post"
        LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
    `;

@ViewEntity({
  expression: POST_CATEGORY_VIEW_EXP,
  name: POST_CATEGORY_VIEW_NAME,
})
export class PostCategory {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  categoryName: string;
}
