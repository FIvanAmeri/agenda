import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Paciente, EstadoPago } from "../entities/paciente.entity";
import { PacientesService } from "../services/pacientes.service";

export class PacientesController {
  private pacientesService: PacientesService;

  constructor() {
    this.pacientesService = new PacientesService();
  }

  async obtenerPacientes(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const pacientes = await this.pacientesService.obtenerPacientes(userId);
      res.json({ pacientes });
    } catch {
      res.status(500).json({ message: "Error al obtener pacientes" });
    }
  }

  async crearPaciente(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { hora, dia, paciente, practicas, obraSocial, institucion } = req.body;
    try {
      const nuevoPaciente = await this.pacientesService.crearPaciente(
        hora,
        dia,
        paciente,
        practicas,
        obraSocial,
        institucion,
        userId
      );
      res
        .status(201)
        .json({ paciente: nuevoPaciente, message: "Paciente agregado con éxito" });
    } catch {
      res.status(500).json({ message: "Error al crear paciente" });
    }
  }

  async actualizarPaciente(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { id } = req.params;
    const { hora, dia, paciente, practicas, obraSocial, institucion } =
      req.body;
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

      if (!pacienteActualizado)
        return res.status(404).json({ message: "Paciente no encontrado" });

      res.json({
        paciente: pacienteActualizado,
        message: "Paciente editado correctamente",
      });
    } catch {
      res.status(500).json({ message: "Error al actualizar paciente" });
    }
  }

  async actualizarEstadoDePago(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const idPaciente = parseInt(req.params.id, 10);
    const { estadoPago, monto } = req.body;

    if (!Object.values(EstadoPago).includes(estadoPago)) {
      return res.status(400).json({
        message:
          "Estado de pago inválido. Valores permitidos: 'no pagado', 'parcialmente pagado', 'pagado'.",
      });
    }

    try {
      const pacienteActualizado =
        await this.pacientesService.actualizarEstadoDePago(
          idPaciente,
          userId,
          estadoPago,
          monto 
        );

      if (!pacienteActualizado) {
        return res.status(404).json({ message: "Paciente no encontrado o no autorizado" });
      }

      res.json({
        paciente: pacienteActualizado,
        message: "Estado de pago actualizado correctamente",
      });
    } catch {
      res.status(500).json({ message: "Error al actualizar el estado de pago" });
    }
  }

  async eliminarPaciente(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

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