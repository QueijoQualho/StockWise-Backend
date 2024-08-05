import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1722897955030 implements MigrationInterface {
    name = 'Default1722897955030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "items" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "data_de_incorporacao" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "salaId" integer, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sala" ("id" SERIAL NOT NULL, "localizacao" character varying NOT NULL, "quantidade" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4e5fe0d3e30b64508d2a59daa40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25" FOREIGN KEY ("salaId") REFERENCES "sala"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25"`);
        await queryRunner.query(`DROP TABLE "sala"`);
        await queryRunner.query(`DROP TABLE "items"`);
    }

}
