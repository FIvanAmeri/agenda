import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Paciente } from "../entities/paciente.entity";

export class PacientesController {
  async obtenerPacientes(req: Request, res: Response) {
    const userId = req.user?.userId;

    try {
      const repo = AppDataSource.getRepository(Paciente);
      const pacientes = await repo.find({ where: { userId } });
      res.json({ pacientes });
    } catch {
      res.status(500).json({ message: "Error al obtener pacientes" });
    }
  }

  async crearPaciente(req: Request, res: Response) {
    const userId = req.user?.userId;

    const { hora, dia, paciente, practicas, obraSocial, institucion } = req.body;
    try {
      const repo = AppDataSource.getRepository(Paciente);
      const nuevoPaciente = repo.create({
        hora,
        dia,
        paciente,
        practicas,
        obraSocial,
        institucion,
        userId,
      });
      await repo.save(nuevoPaciente);
      res
        .status(201)
        .json({ paciente: nuevoPaciente, message: "Paciente agregado con éxito" });
    } catch {
      res.status(500).json({ message: "Error al crear paciente" });
    }
  }

  async actualizarPaciente(req: Request, res: Response) {
    const userId = req.user?.userId;

    const { id } = req.params;
    const { hora, dia, paciente, practicas, obraSocial, institucion } =
      req.body;
    try {
      const repo = AppDataSource.getRepository(Paciente);
      const pacienteExistente = await repo.findOne({
        where: { id: parseInt(id), userId },
      });
      if (!pacienteExistente)
        return res.status(404).json({ message: "Paciente no encontrado" });

      repo.merge(pacienteExistente, {
        hora,
        dia,
        paciente,
        practicas,
        obraSocial,
        institucion,
      });
      const actualizado = await repo.save(pacienteExistente);
      res.json({
        paciente: actualizado,
        message: "Paciente editado correctamente",
      });
    } catch {
      res.status(500).json({ message: "Error al actualizar paciente" });
    }
  }

  async eliminarPaciente(req: Request, res: Response) {
    const userId = req.user?.userId;

    const { id } = req.params;
    try {
      const repo = AppDataSource.getRepository(Paciente);
      const pacienteExistente = await repo.findOne({
        where: { id: parseInt(id), userId },
      });
      if (!pacienteExistente)
        return res.status(404).json({ message: "Paciente no encontrado" });

      await repo.remove(pacienteExistente);
      res.json({ message: "Paciente eliminado" });
    } catch {
      res.status(500).json({ message: "Error al eliminar paciente" });
    }
  }
}
