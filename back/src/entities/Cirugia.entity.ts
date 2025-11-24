import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Medico } from "./Medico.entity";
import { TipoCirugia } from "./TipoCirugia.entity";
import { Paciente } from "./paciente.entity";

@Entity("cirugia")
export class Cirugia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  fecha: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  honorarios: number | null;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: "pacienteId" })
  paciente: Paciente | null;

  @Column({ nullable: true })
  pacienteId: number | null;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: "medicoOperadorId" })
  medicoOperador: Medico | null;

  @Column({ nullable: true })
  medicoOperadorId: number | null;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: "ayudante1Id" })
  ayudante1: Medico | null;

  @Column({ nullable: true })
  ayudante1Id: number | null;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: "ayudante2Id" })
  ayudante2: Medico | null;

  @Column({ nullable: true })
  ayudante2Id: number | null;

  @ManyToOne(() => TipoCirugia)
  @JoinColumn({ name: "tipoCirugiaId" })
  tipoCirugia: TipoCirugia | null;

  @Column({ nullable: true })
  tipoCirugiaId: number | null;
}
