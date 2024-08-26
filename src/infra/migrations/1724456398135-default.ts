import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1724456398135 implements MigrationInterface {
  name = "Default1724456398135";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_4690ab13b3748eb5b362500d60a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" RENAME COLUMN "salaLocalizacao" TO "salaId"`,
    );
    await queryRunner.query(`ALTER TABLE "sala" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "sala" DROP CONSTRAINT "PK_1286a6ccd57f1a6b4e0b530f5f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" ADD CONSTRAINT "PK_340034b072b6858c7b844780861" PRIMARY KEY ("localizacao", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" DROP CONSTRAINT "PK_340034b072b6858c7b844780861"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" ADD CONSTRAINT "PK_4e5fe0d3e30b64508d2a59daa40" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" ADD CONSTRAINT "UQ_1286a6ccd57f1a6b4e0b530f5f7" UNIQUE ("localizacao")`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25" FOREIGN KEY ("salaId") REFERENCES "sala"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_5506ee6f03a1103f62d606a5b25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" DROP CONSTRAINT "UQ_1286a6ccd57f1a6b4e0b530f5f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" DROP CONSTRAINT "PK_4e5fe0d3e30b64508d2a59daa40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" ADD CONSTRAINT "PK_340034b072b6858c7b844780861" PRIMARY KEY ("localizacao", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" DROP CONSTRAINT "PK_340034b072b6858c7b844780861"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sala" ADD CONSTRAINT "PK_1286a6ccd57f1a6b4e0b530f5f7" PRIMARY KEY ("localizacao")`,
    );
    await queryRunner.query(`ALTER TABLE "sala" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "items" RENAME COLUMN "salaId" TO "salaLocalizacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_4690ab13b3748eb5b362500d60a" FOREIGN KEY ("salaLocalizacao") REFERENCES "sala"("localizacao") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
