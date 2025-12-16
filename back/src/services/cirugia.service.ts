import { Repository, Between, FindManyOptions, Like, FindOptionsWhere } from "typeorm";
import AppDataSource from "../data-source";
import { Cirugia } from "../entities/Cirugia.entity";
import { CirugiaConEdad } from "../interfaces/cirugia.interface";

export interface CirugiaFilter {
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
        const whereConditions: FindOptionsWhere<Cirugia>[] = [];
        
        if (filters.dateFrom && filters.dateTo) {
            whereConditions.push({ fecha: Between(filters.dateFrom, filters.dateTo) });
        } else if (filters.dateFrom) {
            whereConditions.push({ fecha: Between(filters.dateFrom, new Date().toISOString().split('T')[0]) });
        } else if (filters.dateTo) {
            whereConditions.push({ fecha: Between('1900-01-01', filters.dateTo) }); 
        }

        if (filters.paciente) {
            whereConditions.push({ paciente: Like(`%${filters.paciente}%`) });
        }
        
        if (filters.tipoCirugia) {
            whereConditions.push({ tipoCirugia: Like(`%${filters.tipoCirugia}%`) });
        }

        if (filters.medico) {
            const medicoFilter = Like(`%${filters.medico}%`);
            whereConditions.push([
                { medicoOpero: medicoFilter },
                { medicoAyudo1: medicoFilter },
                { medicoAyudo2: medicoFilter },
            ] as FindOptionsWhere<Cirugia>);
        }
        
        if (filters.estadoPago) {
            const estado = filters.estadoPago === "pagado" ? "pagado" : "no pagado";
            
            if (filters.estadoPago === "pagado") {
                 whereConditions.push({ estadoPagoHonorarios: estado, estadoPagoPresupuesto: estado });
            } else {
                 whereConditions.push([
                    { estadoPagoHonorarios: "no pagado" },
                    { estadoPagoHonorarios: "parcialmente pagado" },
                    { estadoPagoPresupuesto: "no pagado" },
                    { estadoPagoPresupuesto: "parcialmente pagado" },
                ] as FindOptionsWhere<Cirugia>);
            }
        }
        
        const options: FindManyOptions<Cirugia> = {
            order: { fecha: "DESC" },
        };
        
        if (whereConditions.length > 0) {
            
            if (whereConditions.length === 1 && Array.isArray(whereConditions[0])) {
                options.where = whereConditions[0];
            } else if (whereConditions.length > 0) {
                const finalWhere = whereConditions.flat().filter(Boolean) as FindOptionsWhere<Cirugia>[];
                
                if (finalWhere.length > 0) {
                    options.where = finalWhere.reduce((acc: FindOptionsWhere<Cirugia>, current: FindOptionsWhere<Cirugia>) => {
                        return { ...acc, ...current }; 
                    }, {} as FindOptionsWhere<Cirugia>);
                }
            }
        }
        
        return options;
    }


    async crear(payload: {
        fecha: string;
        paciente: string;
        tipoCirugia: string;
        medicoOpero: string;
        obraSocial?: string | null;
        medicoAyudo1?: string | null;
        medicoAyudo2?: string | null;
        descripcion?: string | null;
        fechaNacimientoPaciente?: string | null;
        montoTotalHonorarios?: number | null;
        montoTotalPresupuesto?: number | null;
    }): Promise<Cirugia> {
        const c = this.repo.create({
            ...payload,
            montoTotalHonorarios: payload.montoTotalHonorarios ?? null,
            montoTotalPresupuesto: payload.montoTotalPresupuesto ?? null,
        });
        return await this.repo.save(c);
    }
    
    async obtenerPorId(id: number): Promise<CirugiaConEdad | null> {
        const cirugia = await this.repo.findOne({ where: { id } });
        if (!cirugia) return null;
        
        return {
            ...cirugia,
            edadPaciente: this.calcularEdad(cirugia.fechaNacimientoPaciente)
        };
    }

    async listar(filters: CirugiaFilter = {}): Promise<CirugiaConEdad[]> {
        const options = this.applyFilters(filters);
        
        const cirugias = await this.repo.find(options);
        
        return cirugias.map(c => ({
            ...c,
            edadPaciente: this.calcularEdad(c.fechaNacimientoPaciente)
        }));
    }
    
    async actualizar(id: number, payload: CirugiaUpdatePayload): Promise<Cirugia> {
        const cirugia = await this.repo.findOne({ where: { id } });

        if (!cirugia) {
            throw new Error(`Cirugía con ID ${id} no encontrada`);
        }

        this.repo.merge(cirugia, payload);
        return await this.repo.save(cirugia);
    }
    
    async eliminar(id: number): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new Error(`Cirugía con ID ${id} no encontrada`);
        }
    }

    private async obtenerValoresUnicos(column: keyof Cirugia): Promise<string[]> {
        const result: { valor: string }[] = await this.repo
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

    async obtenerObrasSocialesUnicas(): Promise<string[]> {
        return this.obtenerValoresUnicos('obraSocial');
    }
}