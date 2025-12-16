import AppDataSource from '../data-source';
import { Paciente, EstadoPago } from '../entities/paciente.entity';

export class PacientesService {
    async crearPaciente(
        hora: string,
        dia: string,
        paciente: string,
        fechaNacimiento: string | null,
        practicas: string,
        obraSocial: string,
        institucion: string,
        userId: number
    ) {
        const pacienteRepository = AppDataSource.getRepository(Paciente);

        const nuevoPaciente = pacienteRepository.create({
            hora,
            dia,
            paciente,
            fechaNacimiento,
            practicas,
            obraSocial,
            institucion,
            userId,
            montoPagado: 0.00,
            montoTotal: 0.00,
            fechaPagoParcial: null,
            fechaPagoTotal: null,
        });

        await pacienteRepository.save(nuevoPaciente);
        return nuevoPaciente;
    }

    async obtenerPacientes(userId: number) {
        const pacienteRepository = AppDataSource.getRepository(Paciente);
        return pacienteRepository.find({ where: { userId } });
    }

    async actualizarPaciente(
        id: string,
        hora: string,
        dia: string,
        paciente: string,
        fechaNacimiento: string | null,
        practicas: string,
        obraSocial: string,
        institucion: string
    ) {
        const pacienteRepository = AppDataSource.getRepository(Paciente);
        const pacienteExistente = await pacienteRepository.findOne({ where: { id: parseInt(id, 10) } });

        if (!pacienteExistente) return null;

        pacienteExistente.hora = hora;
        pacienteExistente.dia = dia;
        pacienteExistente.paciente = paciente;
        pacienteExistente.fechaNacimiento = fechaNacimiento;
        pacienteExistente.practicas = practicas;
        pacienteExistente.obraSocial = obraSocial;
        pacienteExistente.institucion = institucion;

        await pacienteRepository.save(pacienteExistente);
        return pacienteExistente;
    }

    async actualizarEstadoDePago(
        id: number,
        userId: number,
        estadoPago: EstadoPago,
        montoDelta: number,
        fechaPagoParcial: string | null,
        fechaPagoTotal: string | null
    ) {
        const pacienteRepository = AppDataSource.getRepository(Paciente);
        const pacienteExistente = await pacienteRepository.findOne({ where: { id, userId } });

        if (!pacienteExistente) return null;

        const montoActualPagado = Number(pacienteExistente.montoPagado);

        if (estadoPago === EstadoPago.NO_PAGADO) {
            pacienteExistente.estadoPago = EstadoPago.NO_PAGADO;
            pacienteExistente.montoPagado = 0.00;
            pacienteExistente.montoTotal = 0.00;
            pacienteExistente.fechaPagoParcial = null;
            pacienteExistente.fechaPagoTotal = null;
            const saved = await pacienteRepository.save(pacienteExistente);
            return saved;
        }

        if (estadoPago === EstadoPago.PARCIALMENTE_PAGADO) {
            pacienteExistente.estadoPago = EstadoPago.PARCIALMENTE_PAGADO;
            let ultimoPagoParcial = 0;

            if (montoDelta > 0) {
                pacienteExistente.montoPagado = Number((montoActualPagado + montoDelta).toFixed(2));
                ultimoPagoParcial = montoDelta;
            }
            
            pacienteExistente.montoTotal = pacienteExistente.montoTotal;

            if (fechaPagoParcial !== null) pacienteExistente.fechaPagoParcial = fechaPagoParcial;
            const saved = await pacienteRepository.save(pacienteExistente);
            const result = { ...saved, ultimoPagoParcial: ultimoPagoParcial };
            return result;
        }

        if (estadoPago === EstadoPago.PAGADO) {
            pacienteExistente.estadoPago = EstadoPago.PAGADO;
            let ultimoPagoTotal = 0;
            
            if (montoDelta > 0) {
                const nuevoAcumulado = Number((montoActualPagado + montoDelta).toFixed(2));
                pacienteExistente.montoPagado = nuevoAcumulado;
                pacienteExistente.montoTotal = nuevoAcumulado;
                ultimoPagoTotal = montoDelta;
            } else {
                pacienteExistente.montoTotal = Number(montoActualPagado.toFixed(2));
                pacienteExistente.montoPagado = Number(montoActualPagado.toFixed(2));
            }

            if (fechaPagoTotal !== null) pacienteExistente.fechaPagoTotal = fechaPagoTotal;
            const saved = await pacienteRepository.save(pacienteExistente);
            const result = { ...saved, ultimoPagoTotal: ultimoPagoTotal };
            return result;
        }

        const saved = await pacienteRepository.save(pacienteExistente);
        return saved;
    }

    async obtenerObrasSocialesUnicas(userId: number): Promise<string[]> {
        const pacienteRepository = AppDataSource.getRepository(Paciente);
        
        const result = await pacienteRepository
            .createQueryBuilder("paciente")
            .select("DISTINCT paciente.obraSocial", "obraSocial")
            .where("paciente.userId = :userId", { userId })
            .andWhere("paciente.obraSocial IS NOT NULL AND paciente.obraSocial != ''")
            .orderBy("obraSocial", "ASC")
            .getRawMany() as { obraSocial: string }[];

        return result.map(item => item.obraSocial);
    }
}