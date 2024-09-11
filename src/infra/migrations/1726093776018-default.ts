import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1726093776018 implements MigrationInterface {
    name = 'Default1726093776018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "itens" DROP COLUMN "external_id"`);
        await queryRunner.query(`ALTER TABLE "itens" ADD "external_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "itens" DROP COLUMN "external_id"`);
        await queryRunner.query(`ALTER TABLE "itens" ADD "external_id" character varying`);
    }

}
