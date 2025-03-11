import { Request, Response } from 'express';
import { PacientesService } from '../services/pacientes.service';

//Hola soy Ivan
export class PacientesController {
  private pacientesService = new PacientesService();
  async crearPaciente(req: Request, res: Response) {
    try {
      const { dia, paciente, practicas, obraSocial, institucion } = req.body;

      const nuevoPaciente = await this.pacientesService.crearPaciente(dia, paciente, practicas, obraSocial, institucion);
      res.status(201).json({ mensaje: 'Paciente creado con éxito', paciente: nuevoPaciente });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al crear el paciente' });
    }
  }
  async obtenerPacientes(req: Request, res: Response) {
    try {
      const pacientes = await this.pacientesService.obtenerPacientes();
      res.status(200).json(pacientes);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al obtener los pacientes' });
    }
  }
  async actualizarPaciente(req: Request, res: Response) {
    const { id } = req.params;
    const { dia, paciente, practicas, obraSocial, institucion } = req.body;

    try {
      const pacienteActualizado = await this.pacientesService.actualizarPaciente(id, dia, paciente, practicas, obraSocial, institucion);

      if (!pacienteActualizado) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
      }

      return res.status(200).json({ mensaje: 'Paciente actualizado con éxito', paciente: pacienteActualizado });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar el paciente' });
    }
  }
}