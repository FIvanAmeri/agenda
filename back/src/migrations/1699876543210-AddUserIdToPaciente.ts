import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToPaciente1699876543210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "paciente"
      ADD COLUMN "userId" integer
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "paciente"
      DROP COLUMN "userId"
    `);
  }
}
