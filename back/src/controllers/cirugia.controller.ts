import { Request, Response } from "express";
import { CirugiaService } from "../services/cirugia.service";

const service = new CirugiaService();

export class CirugiaController {
  async crear(req: Request, res: Response) {
    const body = req.body;
    const cirugia = await service.crear({
      fecha: body.fecha,
      honorarios: body.honorarios,
      pacienteId: body.pacienteId,
      medicoOperadorId: body.medicoOperadorId,
      ayudante1Id: body.ayudante1Id,
      ayudante2Id: body.ayudante2Id,
      tipoCirugiaId: body.tipoCirugiaId
    });
    res.json({ cirugia });
  }

  async listar(req: Request, res: Response) {
    const data = await service.listar();
    res.json({ data });
  }
}
