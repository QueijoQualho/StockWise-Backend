import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1723163412495 implements MigrationInterface {
    name = 'Default1723163412495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "url"`);
    }

}
