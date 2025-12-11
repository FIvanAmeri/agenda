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
    
    async obtenerMedicos(req: Request, res: Response) {
        try {
            const medicos = await service.obtenerMedicosUnicos();
            res.json({ medicos });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener médicos", error });
        }
    }

    async obtenerTiposCirugia(req: Request, res: Response) {
        try {
            const tipos = await service.obtenerTiposCirugiaUnicos();
            res.json({ tiposCirugia: tipos });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener tipos de cirugía", error });
        }
    }
}