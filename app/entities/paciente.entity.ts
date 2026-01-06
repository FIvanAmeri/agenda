import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

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

    @Column({ type: 'varchar', length: 10, nullable: true })
    fechaNacimiento: string | null;

    @Column()
    practicas: string;

    @Column({ name: 'obrasocial' })
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

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    montoPagado: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    montoTotal: number;


    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    fechaPagoParcial: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    fechaPagoTotal: string | null;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}