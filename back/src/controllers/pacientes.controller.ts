import { Request, Response } from 'express';
import { PacientesService } from '../services/pacientes.service';

export class PacientesController {
  private pacientesService = new PacientesService();

  async crearPaciente(req: Request, res: Response) {
    try {
      const { hora, dia, paciente, practicas, obraSocial, institucion } = req.body;

      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora)) {
        return res.status(400).json({ error: 'Formato de hora inválido. Use HH:mm' });
      }

      const nuevoPaciente = await this.pacientesService.crearPaciente(
        hora,
        dia,
        paciente,
        practicas,
        obraSocial,
        institucion
      );
      
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
    const { hora, dia, paciente, practicas, obraSocial, institucion } = req.body;

    try {
      const pacienteActualizado = await this.pacientesService.actualizarPaciente(
        id,
        hora,
        dia,
        paciente,
        practicas,
        obraSocial,
        institucion
      );

      if (!pacienteActualizado) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
      }

      return res.status(200).json({ mensaje: 'Paciente actualizado con éxito', paciente: pacienteActualizado });
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al actualizar el paciente' });
    }
  }
}