import AppDataSource from '../data-source';
import { Paciente } from '../entities/paciente.entity';

export class PacientesService {
  async crearPaciente(dia: string, paciente: string, practicas: string, obraSocial: string): Promise<Paciente> {
    try {
      const pacienteRepository = AppDataSource.getRepository(Paciente);

      const nuevoPaciente = new Paciente();
      nuevoPaciente.dia = dia;
      nuevoPaciente.paciente = paciente;
      nuevoPaciente.practicas = practicas;
      nuevoPaciente.obraSocial = obraSocial;

      await pacienteRepository.save(nuevoPaciente);

      return nuevoPaciente;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al guardar el paciente: ${error.message}`);
      } else {
        throw new Error('Error desconocido al guardar el paciente');
      }
    }
  }


  async obtenerPacientes(): Promise<Paciente[]> {
    try {
      const pacienteRepository = AppDataSource.getRepository(Paciente);
      const pacientes = await pacienteRepository.find();
      return pacientes;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener los pacientes: ${error.message}`);
      } else {
        throw new Error('Error desconocido al obtener los pacientes');
      }
    }
  }
}
