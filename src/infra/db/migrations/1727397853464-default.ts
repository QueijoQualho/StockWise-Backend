import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1727397853464 implements MigrationInterface {
    name = 'Default1727397853464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuarios_role_enum" AS ENUM('ADMIN', 'USER', 'MODERATOR')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "senha" character varying NOT NULL, "role" "public"."usuarios_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_role_enum"`);
    }

}
