import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1732839948973 implements MigrationInterface {
    name = 'Default1732839948973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salas" DROP COLUMN "qtd_itens"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salas" ADD "qtd_itens" integer NOT NULL DEFAULT '0'`);
    }

}
