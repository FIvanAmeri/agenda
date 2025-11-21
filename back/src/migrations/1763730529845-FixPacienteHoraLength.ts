import { MigrationInterface, QueryRunner } from "typeorm";


export class FixPacienteHoraLength1763730529845 implements MigrationInterface {
    name = 'FixPacienteHoraLength1763730529845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paciente" ALTER COLUMN "hora" TYPE character varying(30)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paciente" ALTER COLUMN "hora" TYPE character varying(5)`);
    }
}