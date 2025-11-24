import { getRepository } from "typeorm";
import { Medico } from "../entities/Medico.entity";

export class MedicoService {
  private repo = getRepository(Medico);

  async crear(payload: { nombre: string; apellido: string }) {
    const medico = this.repo.create(payload);
    return await this.repo.save(medico);
  }

  async listar() {
    return await this.repo.find({ order: { apellido: "ASC" } });
  }
}
