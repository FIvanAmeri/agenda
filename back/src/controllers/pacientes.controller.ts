import { Request, Response } from 'express';
import { PacientesService } from '../services/pacientes.service';

export class PacientesController {
  private pacientesService = new PacientesService();

  async crearPaciente(req: Request, res: Response) {
    try {
      const { dia, paciente, practicas, obraSocial } = req.body;
      const nuevoPaciente = await this.pacientesService.crearPaciente(dia, paciente, practicas, obraSocial);
      res.status(201).json(nuevoPaciente);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al crear el paciente' });
    }
  }
}
