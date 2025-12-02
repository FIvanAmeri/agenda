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
}
