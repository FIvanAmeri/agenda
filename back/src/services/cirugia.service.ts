import { Repository, Between, FindManyOptions, Like } from "typeorm";
import AppDataSource from "../data-source";
import { Cirugia } from "../entities/Cirugia.entity";

export interface CirugiaFilter {
    dateFrom?: string;
    dateTo?: string;
    paciente?: string;
    tipoCirugia?: string;
    medico?: string;
    estadoPago?: "pagado" | "no pagado";
}

export class CirugiaService {
    private repo: Repository<Cirugia>;

    constructor() {
        this.repo = AppDataSource.getRepository(Cirugia);
    }

    private calcularEdad(fechaNacimiento: string | null): number | null {
        if (!fechaNacimiento) return null;
        try {
            const fechaNac = new Date(fechaNacimiento + 'T00:00:00');
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            return edad;
        } catch {
            return null;
        }
    }
    
    private applyFilters(filters: CirugiaFilter): FindManyOptions<Cirugia> {
        const where: any[] = [];
        
        if (filters.dateFrom && filters.dateTo) {
            where.push({ fecha: Between(filters.dateFrom, filters.dateTo) });
        } else if (filters.dateFrom) {
            where.push({ fecha: Between(filters.dateFrom, new Date().toISOString().split('T')[0]) });
        } else if (filters.dateTo) {
            where.push({ fecha: Between('1900-01-01', filters.dateTo) }); 
        }

        if (filters.paciente) {
            where.push({ paciente: Like(`%${filters.paciente}%`) });
        }
        
        if (filters.tipoCirugia) {
            where.push({ tipoCirugia: Like(`%${filters.tipoCirugia}%`) });
        }

        if (filters.medico) {
            const medicoFilter = Like(`%${filters.medico}%`);
            where.push([
                { medicoOpero: medicoFilter },
                { medicoAyudo1: medicoFilter },
                { medicoAyudo2: medicoFilter },
            ]);
        }
        
        if (filters.estadoPago) {
            const estado = filters.estadoPago === "pagado" ? "pagado" : "no pagado";
            const estadoNoPagado = filters.estadoPago === "no pagado" ? "no pagado" : "pagado";
            if (filters.estadoPago === "pagado") {
                 where.push([
                    { estadoPagoHonorarios: estado },
                    { estadoPagoPresupuesto: estado },
                ]);
            } else {
                 where.push([
                    { estadoPagoHonorarios: estadoNoPagado },
                    { estadoPagoPresupuesto: estadoNoPagado },
                ]);
            }
        }
        
        const options: FindManyOptions<Cirugia> = {
            order: { fecha: "DESC" },
        };
        
        if (where.length > 0) {
            if (where.length === 1 && Array.isArray(where[0])) {
                options.where = where[0];
            } else if (where.length > 0) {
                 options.where = where.reduce((acc, current) => {
                    return { ...acc, ...current }; 
                }, {});
            }
        }
        
        return options;
    }


    async crear(payload: {
        fecha: string;
        paciente: string;
        tipoCirugia: string;
        medicoOpero: string;
        medicoAyudo1?: string | null;
        medicoAyudo2?: string | null;
        descripcion?: string | null;
        fechaNacimientoPaciente?: string | null;
        montoTotalHonorarios?: number | null;
        montoTotalPresupuesto?: number | null;
    }) {
        const c = this.repo.create({
            ...payload,
            montoTotalHonorarios: payload.montoTotalHonorarios ?? null,
            montoTotalPresupuesto: payload.montoTotalPresupuesto ?? null,
        });
        return await this.repo.save(c);
    }

    async listar(filters: CirugiaFilter = {}) {
        const options = this.applyFilters(filters);
        
        const cirugias = await this.repo.find(options);
        
     
        return cirugias.map(c => ({
            ...c,
            edadPaciente: this.calcularEdad(c.fechaNacimientoPaciente)
        }));
    }

    private async obtenerValoresUnicos(column: keyof Cirugia): Promise<string[]> {
        const result = await this.repo
            .createQueryBuilder("cirugia")
            .select(`DISTINCT cirugia.${column}`, "valor")
            .where(`cirugia.${column} IS NOT NULL AND cirugia.${column} != ''`)
            .orderBy("valor", "ASC")
            .getRawMany();

        return result.map(item => item.valor);
    }

    async obtenerMedicosUnicos(): Promise<string[]> {
        const opero = await this.obtenerValoresUnicos('medicoOpero');
        const ayudo1 = await this.obtenerValoresUnicos('medicoAyudo1');
        const ayudo2 = await this.obtenerValoresUnicos('medicoAyudo2');
        
        const allMedicos = [...opero, ...ayudo1, ...ayudo2].filter(Boolean) as string[];
        return Array.from(new Set(allMedicos)).sort();
    }

    async obtenerTiposCirugiaUnicos(): Promise<string[]> {
        return this.obtenerValoresUnicos('tipoCirugia');
    }
}