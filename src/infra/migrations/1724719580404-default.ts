import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1724719580404 implements MigrationInterface {
    name = 'Default1724719580404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25"`);
        await queryRunner.query(`DROP TABLE "sala"`);
        await queryRunner.query(`CREATE TABLE "salas" ("id" SERIAL NOT NULL, "localizacao" integer NOT NULL, "nome" character varying NOT NULL, "qtd_itens" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cde91c8f48ea30186b7757bd4f8" UNIQUE ("localizacao"), CONSTRAINT "PK_a74948c5a75eb1be20b46c321e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "items" ADD "external_id" character varying`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "data_de_incorporacao"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "data_de_incorporacao" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "data_de_incorporacao"`);
        await queryRunner.query(`ALTER TABLE "items" ADD "data_de_incorporacao" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "external_id"`);
        await queryRunner.query(`DROP TABLE "salas"`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25" FOREIGN KEY ("salaId") REFERENCES "sala"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
