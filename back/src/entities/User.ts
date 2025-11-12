import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}