import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1723167160489 implements MigrationInterface {
  name = "Default1723167160489";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."items_status_enum" AS ENUM('Disponivel', 'Baixa', 'Em manutenção')`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD "status" "public"."items_status_enum" NOT NULL DEFAULT 'Disponivel'`,
    );
    await queryRunner.query(`ALTER TABLE "items" ADD "url" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "url"`);
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."items_status_enum"`);
  }
}
