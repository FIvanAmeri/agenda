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

  @Column({ type: "text", nullable: true })
  resetToken: string | null;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpires: Date | null;

  @OneToMany(() => Paciente, (paciente) => paciente.user)
  pacientes: Paciente[];
}