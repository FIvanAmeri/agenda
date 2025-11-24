import { Request, Response } from "express";
import { MedicoService } from "../services/medico.service";

const medicoService = new MedicoService();

export class MedicoController {
  async crearMedico(req: Request, res: Response) {
    const { nombre, apellido } = req.body as { nombre: string; apellido: string };
    try {
      const medico = await medicoService.crear({ nombre, apellido });
      return res.status(201).json({ medico });
    } catch (err) {
      return res.status(500).json({ message: "Error al crear médico" });
    }
  }

  async listarMedicos(req: Request, res: Response) {
    try {
      const medicos = await medicoService.listar();
      return res.json({ medicos });
    } catch (err) {
      return res.status(500).json({ message: "Error al listar médicos" });
    }
  }
}
