import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1729305214152 implements MigrationInterface {
    name = 'Default1729305214152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salas" ADD "pdf_url" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."usuarios_role_enum" RENAME TO "usuarios_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "role" TYPE "public"."usuarios_role_enum" USING "role"::"text"::"public"."usuarios_role_enum"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuarios_role_enum_old" AS ENUM('ADMIN', 'USER', 'MODERATOR')`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "role" TYPE "public"."usuarios_role_enum_old" USING "role"::"text"::"public"."usuarios_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."usuarios_role_enum_old" RENAME TO "usuarios_role_enum"`);
        await queryRunner.query(`ALTER TABLE "salas" DROP COLUMN "pdf_url"`);
    }

}
