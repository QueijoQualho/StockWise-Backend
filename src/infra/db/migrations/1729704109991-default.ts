import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1729704109991 implements MigrationInterface {
    name = 'Default1729704109991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Relatorios" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "url" character varying NOT NULL, "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "salaId" integer, CONSTRAINT "PK_b918ab78238f460e5d2181d3baf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "salas" DROP COLUMN "pdf_url"`);
        await queryRunner.query(`ALTER TABLE "Relatorios" ADD CONSTRAINT "FK_90ec036cbe4a860cbfa0fe8a7ab" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Relatorios" DROP CONSTRAINT "FK_90ec036cbe4a860cbfa0fe8a7ab"`);
        await queryRunner.query(`ALTER TABLE "salas" ADD "pdf_url" character varying`);
        await queryRunner.query(`DROP TABLE "Relatorios"`);
    }

}
