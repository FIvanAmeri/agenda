import { Request, Response } from "express";
import { TipoCirugiaService } from "../services/tipoCirugia.service";

const tipoService = new TipoCirugiaService();

export class TipoCirugiaController {
  async crearTipo(req: Request, res: Response) {
    const { nombre } = req.body as { nombre: string };
    try {
      const tipo = await tipoService.crear({ nombre });
      return res.status(201).json({ tipo });
    } catch (err) {
      return res.status(500).json({ message: "Error al crear tipo" });
    }
  }

  async listarTipos(req: Request, res: Response) {
    try {
      const tipos = await tipoService.listar();
      return res.json({ tipos });
    } catch (err) {
      return res.status(500).json({ message: "Error al listar tipos" });
    }
  }
}
