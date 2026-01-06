import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Paciente } from './paciente.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario: string; 

  @Column({ unique: true })
  email: string;

  @Column()
  contrasena: string;

  @OneToMany(() => Paciente, (paciente) => paciente.user)
  pacientes: Paciente[];
}