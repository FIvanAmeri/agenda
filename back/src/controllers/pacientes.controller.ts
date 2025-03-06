import { Request, Response } from 'express';
import { PacientesService } from '../services/pacientes.service';

export class PacientesController {
  private pacientesService = new PacientesService();
  async crearPaciente(req: Request, res: Response) {
    try {
      const { dia, paciente, practicas, obraSocial } = req.body;

      const nuevoPaciente = await this.pacientesService.crearPaciente(dia, paciente, practicas, obraSocial);
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
}
