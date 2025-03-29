import AppDataSource from '../data-source';
import { PacienteMasivo } from '../entities/pacienteMasivo.entity';

export class PacientesMasivosService {
  async crearPacientesMasivos(pacientes: PacienteMasivo[]) {
    const pacienteMasivoRepository = AppDataSource.getRepository(PacienteMasivo);
    const nuevosPacientes = pacienteMasivoRepository.create(pacientes);
    await pacienteMasivoRepository.save(nuevosPacientes);
    return nuevosPacientes;
  }
  
  async obtenerPacientesMasivos() {
    const pacienteMasivoRepository = AppDataSource.getRepository(PacienteMasivo);
    return pacienteMasivoRepository.find();
  }
}
