import AppDataSource from '../data-source';
import { Paciente, EstadoPago } from '../entities/paciente.entity';

export class PacientesService {
  async crearPaciente(
    hora: string,
    dia: string,
    paciente: string,
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
      practicas,
      obraSocial,
      institucion,
      userId,
      montoPagado: 0,
      montoTotal: 0,
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
    montoDelta?: number
  ) {
    const pacienteRepository = AppDataSource.getRepository(Paciente);
    const pacienteExistente = await pacienteRepository.findOne({
      where: { id, userId },
    });

    if (!pacienteExistente) return null;

    pacienteExistente.estadoPago = estadoPago;

    if (montoDelta !== undefined) {
      if (estadoPago === EstadoPago.NO_PAGADO) {
        pacienteExistente.montoPagado = 0;
      } else {
        const montoActual = parseFloat(pacienteExistente.montoPagado.toString());
        const nuevoMonto = montoActual + montoDelta;
        pacienteExistente.montoPagado = nuevoMonto;
        if (estadoPago === EstadoPago.PAGADO && pacienteExistente.montoTotal === 0) {
          pacienteExistente.montoTotal = nuevoMonto;
        }
      }
    }

    await pacienteRepository.save(pacienteExistente);
    return pacienteExistente;
  }
}