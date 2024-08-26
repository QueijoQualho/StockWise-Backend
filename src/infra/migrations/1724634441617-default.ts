import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1724634441617 implements MigrationInterface {
    name = 'Default1724634441617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sala" RENAME COLUMN "quantidadeDeItens" TO "qtd_itens"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sala" RENAME COLUMN "qtd_itens" TO "quantidadeDeItens"`);
    }

}
