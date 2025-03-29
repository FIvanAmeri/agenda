import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pacientes_masivos')
export class PacienteMasivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paciente: string;

  @Column()
  practicas: string;

  @Column()
  obraSocial: string;

  @Column({ type: 'varchar', length: 10 })
  dia: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institucion: string;
}
