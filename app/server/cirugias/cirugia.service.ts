import { AppDataSource, initializeDatabase } from "../../lib/data-source";
import { Cirugia } from "../../entities/Cirugia.entity";
import { Between, Like, Repository, FindOptionsWhere } from "typeorm";

type EstadoPago = "no pagado" | "parcialmente pagado" | "pagado";

interface FiltrosListar {
    usuarioId: number;
    dateFrom?: string;
    dateTo?: string;
    paciente?: string;
    tipoCirugia?: string;
    medico?: string;
    estadoPago?: EstadoPago;
}

export class CirugiaService {
    private async getRepo(): Promise<Repository<Cirugia>> {
        await initializeDatabase();
        return AppDataSource.getRepository(Cirugia);
    }

    async crear(data: Partial<Cirugia>): Promise<Cirugia> {
        const repo = await this.getRepo();
        const nueva = repo.create(data);
        return await repo.save(nueva);
    }

    async obtenerPorId(id: number, usuarioId: number): Promise<Cirugia | null> {
        const repo = await this.getRepo();
        return await repo.findOne({ where: { id, usuarioId } });
    }

    async listar(filters: FiltrosListar): Promise<Cirugia[]> {
        const { usuarioId, dateFrom, dateTo, paciente, tipoCirugia, medico, estadoPago } = filters;
        const repo = await this.getRepo();
        const where: FindOptionsWhere<Cirugia> = { usuarioId };

        if (dateFrom && dateTo) {
            where.fecha = Between(dateFrom, dateTo);
        }
        if (paciente) {
            where.paciente = Like(`%${paciente}%`);
        }
        if (tipoCirugia) {
            where.tipoCirugia = Like(`%${tipoCirugia}%`);
        }
        if (medico) {
            where.medicoOpero = Like(`%${medico}%`);
        }
        if (estadoPago) {
            where.estadoPagoHonorarios = estadoPago;
        }

        return await repo.find({
            where,
            order: { fecha: "DESC", id: "DESC" }
        });
    }

    async actualizar(id: number, usuarioId: number, data: Partial<Cirugia>): Promise<Cirugia | null> {
        const repo = await this.getRepo();
        const cirugia = await this.obtenerPorId(id, usuarioId);
        if (!cirugia) {
            throw new Error("Cirugía no encontrada");
        }

        const sanitized: Partial<Cirugia> = { ...data };

        if (sanitized.montoTotalHonorarios !== undefined) {
            sanitized.montoTotalHonorarios = Number.isFinite(sanitized.montoTotalHonorarios)
                ? sanitized.montoTotalHonorarios
                : 0;
        }

        if (sanitized.montoPagadoHonorarios !== undefined) {
            sanitized.montoPagadoHonorarios = Number.isFinite(sanitized.montoPagadoHonorarios)
                ? sanitized.montoPagadoHonorarios
                : 0;
        }

        if (sanitized.montoTotalPresupuesto !== undefined) {
            sanitized.montoTotalPresupuesto = Number.isFinite(sanitized.montoTotalPresupuesto)
                ? sanitized.montoTotalPresupuesto
                : 0;
        }

        if (sanitized.montoPagadoPresupuesto !== undefined) {
            sanitized.montoPagadoPresupuesto = Number.isFinite(sanitized.montoPagadoPresupuesto)
                ? sanitized.montoPagadoPresupuesto
                : 0;
        }

        Object.assign(cirugia, sanitized);
        return await repo.save(cirugia);
    }

    async eliminar(id: number, usuarioId: number): Promise<void> {
        const repo = await this.getRepo();
        const cirugia = await this.obtenerPorId(id, usuarioId);
        if (!cirugia) {
            throw new Error("Cirugía no encontrada");
        }
        await repo.remove(cirugia);
    }

    async obtenerMedicosUnicos(usuarioId: number): Promise<string[]> {
        const repo = await this.getRepo();

        const cirugias = await repo.find({
            where: { usuarioId },
            select: {
                medicoOpero: true,
                medicoAyudo1: true,
                medicoAyudo2: true
            }
        });

        const medicos = new Set<string>();

        cirugias.forEach(c => {
            medicos.add(c.medicoOpero);
            if (c.medicoAyudo1) medicos.add(c.medicoAyudo1);
            if (c.medicoAyudo2) medicos.add(c.medicoAyudo2);
        });

        return Array.from(medicos).sort();
    }

    async obtenerTiposCirugiaUnicos(usuarioId: number): Promise<string[]> {
        const repo = await this.getRepo();
        const result = await repo
            .createQueryBuilder("cirugia")
            .select("DISTINCT cirugia.tipoCirugia", "tipo")
            .where("cirugia.usuarioId = :usuarioId", { usuarioId })
            .getRawMany<{ tipo: string }>();

        return result.map(r => r.tipo).filter(Boolean);
    }

    async obtenerObrasSocialesUnicas(usuarioId: number): Promise<string[]> {
        const repo = await this.getRepo();
        const result = await repo
            .createQueryBuilder("cirugia")
            .select("DISTINCT cirugia.obraSocial", "os")
            .where("cirugia.usuarioId = :usuarioId", { usuarioId })
            .getRawMany<{ os: string }>();

        return result.map(r => r.os).filter(Boolean);
    }
}
