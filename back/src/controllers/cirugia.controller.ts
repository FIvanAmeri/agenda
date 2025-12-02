import { Request, Response } from "express";
import { CirugiaService } from "../services/cirugia.service";

const service = new CirugiaService();

export class CirugiaController {
  async crear(req: Request, res: Response) {
    const body = req.body;

    const cirugia = await service.crear({
      fecha: body.fecha,
      paciente: body.paciente,
      tipoCirugia: body.tipoCirugia,
      medicoOpero: body.medicoOpero,
      medicoAyudo1: body.medicoAyudo1,
      medicoAyudo2: body.medicoAyudo2,
      honorarios: body.honorarios,
      descripcion: body.descripcion
    });

    return res.json({ cirugia });
  }

  async listar(req: Request, res: Response) {
    const data = await service.listar();
    res.json({ data });
  }
}
