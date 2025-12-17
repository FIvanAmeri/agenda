import { Repository, Between, FindManyOptions, Like, FindOptionsWhere } from "typeorm";
import AppDataSource from "../data-source";
import { Cirugia } from "../entities/Cirugia.entity";
import { CirugiaConEdad } from "../interfaces/cirugia.interface";

export interface CirugiaFilter {
    usuarioId: number;
    dateFrom?: string;
    dateTo?: string;
    paciente?: string;
    tipoCirugia?: string;
    medico?: string;
    estadoPago?: "pagado" | "no pagado";
}

export interface CirugiaUpdatePayload {
    fecha?: string;
    paciente?: string;
    fechaNacimientoPaciente?: string | null;
    obraSocial?: string | null;
    tipoCirugia?: string;
    medicoOpero?: string;
    medicoAyudo1?: string | null;
    medicoAyudo2?: string | null;
    montoTotalHonorarios?: number | null;
    montoPagadoHonorarios?: number;
    estadoPagoHonorarios?: Cirugia["estadoPagoHonorarios"];
    montoTotalPresupuesto?: number | null;
    montoPagadoPresupuesto?: number;
    estadoPagoPresupuesto?: Cirugia["estadoPagoPresupuesto"];
    descripcion?: string | null;
}

export class CirugiaService {
    private repo: Repository<Cirugia>;

    constructor() {
        this.repo = AppDataSource.getRepository(Cirugia);
    }

    private calcularEdad(fechaNacimiento: string | null): number | null {
        if (!fechaNacimiento) return null;
        const fechaNac = new Date(fechaNacimiento + 'T00:00:00');
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    }
    
    private applyFilters(filters: CirugiaFilter): FindManyOptions<Cirugia> {
        const baseWhere: FindOptionsWhere<Cirugia> = { usuarioId: filters.usuarioId };
        const conditions: FindOptionsWhere<Cirugia>[] = [];

        if (filters.dateFrom && filters.dateTo) {
            conditions.push({ ...baseWhere, fecha: Between(filters.dateFrom, filters.dateTo) });
        } else if (filters.dateFrom) {
            conditions.push({ ...baseWhere, fecha: Between(filters.dateFrom, new Date().toISOString().split('T')[0]) });
        } else if (filters.dateTo) {
            conditions.push({ ...baseWhere, fecha: Between('1900-01-01', filters.dateTo) }); 
        }

        if (filters.paciente) {
            conditions.push({ ...baseWhere, paciente: Like(`%${filters.paciente}%`) });
        }
        
        if (filters.tipoCirugia) {
            conditions.push({ ...baseWhere, tipoCirugia: Like(`%${filters.tipoCirugia}%`) });
        }

        if (filters.medico) {
            const med = Like(`%${filters.medico}%`);
            conditions.push({ ...baseWhere, medicoOpero: med });
            conditions.push({ ...baseWhere, medicoAyudo1: med });
            conditions.push({ ...baseWhere, medicoAyudo2: med });
        }
        
        if (filters.estadoPago) {
            const est = filters.estadoPago === "pagado" ? "pagado" : "no pagado";
            if (est === "pagado") {
                 conditions.push({ ...baseWhere, estadoPagoHonorarios: "pagado", estadoPagoPresupuesto: "pagado" });
            } else {
                 conditions.push({ ...baseWhere, estadoPagoHonorarios: "no pagado" });
                 conditions.push({ ...baseWhere, estadoPagoHonorarios: "parcialmente pagado" });
                 conditions.push({ ...baseWhere, estadoPagoPresupuesto: "no pagado" });
                 conditions.push({ ...baseWhere, estadoPagoPresupuesto: "parcialmente pagado" });
            }
        }

        if (conditions.length === 0) {
            return { where: baseWhere, order: { fecha: "DESC" } };
        }

        return { where: conditions, order: { fecha: "DESC" } };
    }

    async crear(payload: Partial<Cirugia> & { usuarioId: number }): Promise<Cirugia> {
        const c = this.repo.create(payload);
        return await this.repo.save(c);
    }
    
    async obtenerPorId(id: number, usuarioId: number): Promise<CirugiaConEdad | null> {
        const cirugia = await this.repo.findOne({ where: { id, usuarioId } });
        if (!cirugia) return null;
        return {
            ...cirugia,
            edadPaciente: this.calcularEdad(cirugia.fechaNacimientoPaciente)
        };
    }

    async listar(filters: CirugiaFilter): Promise<CirugiaConEdad[]> {
        const options = this.applyFilters(filters);
        const cirugias = await this.repo.find(options);
        return cirugias.map(c => ({
            ...c,
            edadPaciente: this.calcularEdad(c.fechaNacimientoPaciente)
        }));
    }
    
    async actualizar(id: number, usuarioId: number, payload: CirugiaUpdatePayload): Promise<Cirugia> {
        const cirugia = await this.repo.findOne({ where: { id, usuarioId } });
        if (!cirugia) throw new Error("Cirugía no encontrada");
        this.repo.merge(cirugia, payload);
        return await this.repo.save(cirugia);
    }
    
    async eliminar(id: number, usuarioId: number): Promise<void> {
        const result = await this.repo.delete({ id, usuarioId });
        if (result.affected === 0) throw new Error("Cirugía no encontrada");
    }

    async obtenerMedicosUnicos(usuarioId: number): Promise<string[]> {
        const opero = await this.obtenerValoresUnicos('medicoOpero', usuarioId);
        const ayudo1 = await this.obtenerValoresUnicos('medicoAyudo1', usuarioId);
        const ayudo2 = await this.obtenerValoresUnicos('medicoAyudo2', usuarioId);
        const total = [...opero, ...ayudo1, ...ayudo2].filter(Boolean);
        return Array.from(new Set(total)).sort();
    }

    private async obtenerValoresUnicos(column: keyof Cirugia, usuarioId: number): Promise<string[]> {
        const result = await this.repo
            .createQueryBuilder("cirugia")
            .select(`DISTINCT cirugia.${column}`, "valor")
            .where("cirugia.usuarioId = :usuarioId", { usuarioId })
            .andWhere(`cirugia.${column} IS NOT NULL AND cirugia.${column} != ''`)
            .getRawMany();
        return result.map(item => item.valor);
    }

    async obtenerTiposCirugiaUnicos(usuarioId: number): Promise<string[]> {
        return this.obtenerValoresUnicos('tipoCirugia', usuarioId);
    }

    async obtenerObrasSocialesUnicas(usuarioId: number): Promise<string[]> {
        return this.obtenerValoresUnicos('obraSocial', usuarioId);
    }
}