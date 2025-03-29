import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('paciente')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  hora: string;

  @Column({ type: 'varchar', length: 10 })
  dia: string;

  @Column()
  paciente: string;

  @Column()
  practicas: string;

  @Column()
  obraSocial: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institucion: string;
}