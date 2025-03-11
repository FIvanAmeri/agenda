import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pacientes_masivos')  // Asegúrate de que el nombre de la tabla sea correcto
export class PacienteMasivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paciente: string;

  @Column()
  practicas: string;

  @Column()
  obraSocial: string;

  @Column()
  dia: string;  // O Date si el formato de la columna es de fecha

  @Column()
  institucion: string;
}
