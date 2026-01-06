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
        if (!cirugia) throw new Error("Cirugía no encontrada");
        Object.assign(cirugia, data);
        return await repo.save(cirugia);
    }

    async eliminar(id: number, usuarioId: number): Promise<void> {
        const repo = await this.getRepo();
        const cirugia = await this.obtenerPorId(id, usuarioId);
        if (!cirugia) throw new Error("Cirugía no encontrada");
        await repo.remove(cirugia);
    }

    async obtenerMedicosUnicos(usuarioId: number): Promise<string[]> {
        const repo = await this.getRepo();
        const result = await repo
            .createQueryBuilder("cirugia")
            .select("DISTINCT cirugia.medicoOpero", "medico")
            .where("cirugia.usuarioId = :usuarioId", { usuarioId })
            .getRawMany<{ medico: string }>();
        return result.map((r: { medico: string }): string => r.medico).filter(Boolean);
    }

    async obtenerTiposCirugiaUnicos(usuarioId: number): Promise<string[]> {
        const repo = await this.getRepo();
        const result = await repo
            .createQueryBuilder("cirugia")
            .select("DISTINCT cirugia.tipoCirugia", "tipo")
            .where("cirugia.usuarioId = :usuarioId", { usuarioId })
            .getRawMany<{ tipo: string }>();
        return result.map((r: { tipo: string }): string => r.tipo).filter(Boolean);
    }

    async obtenerObrasSocialesUnicas(usuarioId: number): Promise<string[]> {
        const repo = await this.getRepo();
        const result = await repo
            .createQueryBuilder("cirugia")
            .select("DISTINCT cirugia.obraSocial", "os")
            .where("cirugia.usuarioId = :usuarioId", { usuarioId })
            .getRawMany<{ os: string }>();
        return result.map((r: { os: string }): string => r.os).filter(Boolean);
    }
}