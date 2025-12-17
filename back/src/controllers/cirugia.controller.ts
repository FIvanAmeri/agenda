import { Request, Response } from "express";
import { CirugiaService } from "../services/cirugia.service";

const service = new CirugiaService();

export class CirugiaController {
    async crear(req: Request, res: Response) {
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        const body = req.body;
        const cirugia = await service.crear({ ...body, usuarioId });
        return res.json({ cirugia });
    }

    async obtenerPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        try {
            const cirugia = await service.obtenerPorId(id, usuarioId);
            if (!cirugia) return res.status(404).json({ message: "No encontrado" });
            return res.json({ data: cirugia });
        } catch {
            return res.status(500).json({ message: "Error" });
        }
    }

    async listar(req: Request, res: Response) {
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        const filters = {
            usuarioId,
            dateFrom: req.query.dateFrom as string,
            dateTo: req.query.dateTo as string,
            paciente: req.query.paciente as string,
            tipoCirugia: req.query.tipoCirugia as string,
            medico: req.query.medico as string,
            estadoPago: req.query.estadoPago as "pagado" | "no pagado",
        };
        const data = await service.listar(filters);
        return res.json({ data });
    }
    
    async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        try {
            const data = await service.actualizar(id, usuarioId, req.body);
            return res.json({ data });
        } catch {
            return res.status(500).json({ message: "Error" });
        }
    }

    async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        try {
            await service.eliminar(id, usuarioId);
            return res.status(204).send();
        } catch {
            return res.status(500).json({ message: "Error" });
        }
    }

    async obtenerMedicos(req: Request, res: Response) {
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        try {
            const medicos = await service.obtenerMedicosUnicos(usuarioId);
            return res.json({ medicos });
        } catch {
            return res.status(500).json({ message: "Error" });
        }
    }

    async obtenerTiposCirugia(req: Request, res: Response) {
        const usuarioId = (req as any).user.userId || (req as any).user.id;
        try {
            const tiposCirugia = await service.obtenerTiposCirugiaUnicos(usuarioId);
            return res.json({ tiposCirugia });
        } catch {
            return res.status(500).json({ message: "Error" });
        }
    }
}