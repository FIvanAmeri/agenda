import { getRepository } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';

export class PacientesService {
  async crearPaciente(dia: number, paciente: string, practicas: string, obraSocial: string) {
    const pacienteRepository = getRepository(Paciente);
    const nuevoPaciente = pacienteRepository.create({
      dia,
      paciente,
      practicas,
      obraSocial,
    });

    return await pacienteRepository.save(nuevoPaciente);
  }
}
