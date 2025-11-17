import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1763374046211 implements MigrationInterface {
    name = 'InitialSchema1763374046211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prompts_daniel" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "prompt_key" character varying(255) NOT NULL, "version" character varying(50) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "date_creation" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "model_name" character varying(100) NOT NULL, "content" text NOT NULL, "description" text, "tags" jsonb DEFAULT '[]', "created_by" character varying(255) NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8dc3f370817082ba3f975e8c5cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_95cc8b2fb9dddf2e680eb1e6bb" ON "prompts_daniel" ("prompt_key") WHERE "is_active" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_616624c0a0806918a810953330" ON "prompts_daniel" ("prompt_key", "version") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_616624c0a0806918a810953330"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95cc8b2fb9dddf2e680eb1e6bb"`);
        await queryRunner.query(`DROP TABLE "prompts_daniel"`);
    }

}
