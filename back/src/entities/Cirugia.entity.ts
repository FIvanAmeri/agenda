import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("cirugia")
export class Cirugia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  fecha: string;

  @Column({ type: "varchar", length: 255 })
  paciente: string;

  @Column({ type: "varchar", length: 255 })
  tipoCirugia: string;

  @Column({ type: "varchar", length: 255 })
  medicoOpero: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  medicoAyudo1: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  medicoAyudo2: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  honorarios: number | null;

  @Column({ type: "text", nullable: true })
  descripcion: string | null;
}
