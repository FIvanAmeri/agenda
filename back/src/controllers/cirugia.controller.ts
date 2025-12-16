import { Request, Response } from "express";
import { CirugiaService } from "../services/cirugia.service";

const service = new CirugiaService();

export class CirugiaController {
    async crear(req: Request, res: Response) {
        const body = req.body;

        const cirugia = await service.crear({
            fecha: body.fecha,
            paciente: body.paciente,
            fechaNacimientoPaciente: body.fechaNacimientoPaciente, 
            obraSocial: body.obraSocial,
            tipoCirugia: body.tipoCirugia,
            medicoOpero: body.medicoOpero,
            medicoAyudo1: body.medicoAyudo1,
            medicoAyudo2: body.medicoAyudo2,
            montoTotalHonorarios: body.montoTotalHonorarios, 
            montoTotalPresupuesto: body.montoTotalPresupuesto, 
            descripcion: body.descripcion
        });

        return res.json({ cirugia });
    }

    async obtenerPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de cirugía inválido" });
        }
        
        try {
            const cirugia = await service.obtenerPorId(id);
            if (!cirugia) {
                return res.status(404).json({ message: "Cirugía no encontrada" });
            }
            return res.json({ data: cirugia });
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener la cirugía" });
        }
    }

    async listar(req: Request, res: Response) {
        const filters = {
            dateFrom: req.query.dateFrom as string,
            dateTo: req.query.dateTo as string,
            paciente: req.query.paciente as string,
            tipoCirugia: req.query.tipoCirugia as string,
            medico: req.query.medico as string,
            estadoPago: req.query.estadoPago as "pagado" | "no pagado",
        };
        
        const data = await service.listar(filters);
        res.json({ data });
    }
    
    async actualizar(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const body = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de cirugía inválido" });
        }

        try {
            const cirugiaActualizada = await service.actualizar(id, body);
            return res.json({ data: cirugiaActualizada });
        } catch (error) {
            if (error instanceof Error && error.message.includes("no encontrada")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error al actualizar la cirugía" });
        }
    }

    async eliminar(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de cirugía inválido" });
        }

        try {
            await service.eliminar(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message.includes("no encontrada")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error al eliminar la cirugía" });
        }
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