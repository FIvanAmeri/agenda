import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum EstadoPago {
  NO_PAGADO = 'no pagado',
  PARCIALMENTE_PAGADO = 'parcialmente pagado',
  PAGADO = 'pagado',
}

@Entity('paciente')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
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

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.NO_PAGADO,
  })
  estadoPago: EstadoPago;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}