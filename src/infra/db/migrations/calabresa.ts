import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1725161378888 implements MigrationInterface {
  name = "Default1725161378888";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."itens_status_enum" AS ENUM('Disponivel', 'Baixa', 'Em manutenção')`,
    );
    await queryRunner.query(
      `CREATE TABLE "itens" ("id" SERIAL NOT NULL, "external_id" character varying, "nome" character varying NOT NULL, "data_de_incorporacao" date NOT NULL, "status" "public"."itens_status_enum" NOT NULL DEFAULT 'Disponivel', "url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "salaId" integer, CONSTRAINT "PK_b090d1e0e0721a15b3f9f0c6f0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "salas" ("id" SERIAL NOT NULL, "localizacao" integer NOT NULL, "nome" character varying NOT NULL, "qtd_itens" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cde91c8f48ea30186b7757bd4f8" UNIQUE ("localizacao"), CONSTRAINT "PK_a74948c5a75eb1be20b46c321e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "itens" ADD CONSTRAINT "FK_8ab4f5fe56509a7e5e4df8bde25" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "items" `);
    await queryRunner.query(`DROP TABLE "sala" `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itens" DROP CONSTRAINT "FK_8ab4f5fe56509a7e5e4df8bde25"`,
    );
    await queryRunner.query(`DROP TABLE "salas"`);
    await queryRunner.query(`DROP TABLE "itens"`);
    await queryRunner.query(`DROP TYPE "public"."itens_status_enum"`);
  }
}
