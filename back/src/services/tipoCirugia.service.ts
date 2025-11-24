import { getRepository } from "typeorm";
import { TipoCirugia } from "../entities/TipoCirugia.entity";

export class TipoCirugiaService {
  private repo = getRepository(TipoCirugia);

  async crear(payload: { nombre: string }) {
    const tipo = this.repo.create(payload);
    return await this.repo.save(tipo);
  }

  async listar() {
    return await this.repo.find({ order: { nombre: "ASC" } });
  }
}
