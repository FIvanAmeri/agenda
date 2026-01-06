import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

type EstadoPago = "no pagado" | "parcialmente pagado" | "pagado";

@Entity("cirugia")
export class Cirugia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    usuarioId: number;

    @Column({ type: "date" })
    fecha: string;

    @Column({ type: "varchar", length: 255 })
    paciente: string;

    @Column({ type: "date", nullable: true })
    fechaNacimientoPaciente: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    obraSocial: string | null;

    @Column({ type: "varchar", length: 255 })
    tipoCirugia: string;

    @Column({ type: "varchar", length: 255 })
    medicoOpero: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    medicoAyudo1: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    medicoAyudo2: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    montoTotalHonorarios: number | null;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    montoPagadoHonorarios: number;
    
    @Column({ type: "enum", enum: ["no pagado", "parcialmente pagado", "pagado"], default: "no pagado" })
    estadoPagoHonorarios: EstadoPago;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    montoTotalPresupuesto: number | null;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    montoPagadoPresupuesto: number;
    
    @Column({ type: "enum", enum: ["no pagado", "parcialmente pagado", "pagado"], default: "no pagado" })
    estadoPagoPresupuesto: EstadoPago;

    @Column({ type: "text", nullable: true })
    descripcion: string | null;
}