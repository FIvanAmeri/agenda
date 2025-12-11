import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Cirugia } from "../entities/Cirugia.entity";

export class CirugiaService {
    private repo: Repository<Cirugia>;

    constructor() {
        this.repo = AppDataSource.getRepository(Cirugia);
    }

    async crear(payload: {
        fecha: string;
        paciente: string;
        tipoCirugia: string;
        medicoOpero: string;
        medicoAyudo1?: string | null;
        medicoAyudo2?: string | null;
        honorarios?: number | null;
        descripcion?: string | null;
    }) {
        const c = this.repo.create(payload);
        return await this.repo.save(c);
    }

    async listar() {
        return await this.repo.find({
            order: { fecha: "DESC" }
        });
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
        
        const allMedicos = [...opero, ...ayudo1, ...ayudo2];
        return Array.from(new Set(allMedicos)).sort();
    }

    async obtenerTiposCirugiaUnicos(): Promise<string[]> {
        return this.obtenerValoresUnicos('tipoCirugia');
    }
}