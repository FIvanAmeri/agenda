import  AppDataSource  from '../data-source';
import { Paciente } from '../entities/paciente.entity';

export class PacientesService {
  async crearPaciente(dia: string, paciente: string, practicas: string, obraSocial: string, institucion: string) {
    const pacienteRepository = AppDataSource.getRepository(Paciente);

    const nuevoPaciente = pacienteRepository.create({
      dia,
      paciente,
      practicas,
      obraSocial,
      institucion,
    });

    await pacienteRepository.save(nuevoPaciente);
    return nuevoPaciente;
  }
  async obtenerPacientes() {
    const pacienteRepository = AppDataSource.getRepository(Paciente);
    return pacienteRepository.find();
  }


  async actualizarPaciente(id: string, dia: string, paciente: string, practicas: string, obraSocial: string, institucion: string) {
    const pacienteRepository = AppDataSource.getRepository(Paciente);
    const pacienteExistente = await pacienteRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!pacienteExistente) {
      return null;
    }

    pacienteExistente.dia = dia;
    pacienteExistente.paciente = paciente;
    pacienteExistente.practicas = practicas;
    pacienteExistente.obraSocial = obraSocial;
    pacienteExistente.institucion = institucion;
    await pacienteRepository.save(pacienteExistente);
    return pacienteExistente;
  }
}