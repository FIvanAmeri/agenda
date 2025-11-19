import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

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

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}