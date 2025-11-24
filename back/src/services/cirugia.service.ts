import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Cirugia } from "../entities/Cirugia.entity";
import { Medico } from "../entities/Medico.entity";
import { TipoCirugia } from "../entities/TipoCirugia.entity";
import { Paciente } from "../entities/paciente.entity";

export class CirugiaService {
  private repo: Repository<Cirugia>;
  private medicoRepo: Repository<Medico>;
  private tipoRepo: Repository<TipoCirugia>;
  private pacienteRepo: Repository<Paciente>;

  constructor() {
    this.repo = AppDataSource.getRepository(Cirugia);
    this.medicoRepo = AppDataSource.getRepository(Medico);
    this.tipoRepo = AppDataSource.getRepository(TipoCirugia);
    this.pacienteRepo = AppDataSource.getRepository(Paciente);
  }

  async crear(payload: {
    fecha: string;
    honorarios: number | null;
    pacienteId: number | null;
    medicoOperadorId: number | null;
    ayudante1Id: number | null;
    ayudante2Id: number | null;
    tipoCirugiaId: number | null;
  }) {
    const c = new Cirugia();
    c.fecha = payload.fecha;
    c.honorarios = payload.honorarios;

    c.paciente = payload.pacienteId
      ? await this.pacienteRepo.findOneBy({ id: payload.pacienteId })
      : null;

    c.medicoOperador = payload.medicoOperadorId
      ? await this.medicoRepo.findOneBy({ id: payload.medicoOperadorId })
      : null;

    c.ayudante1 = payload.ayudante1Id
      ? await this.medicoRepo.findOneBy({ id: payload.ayudante1Id })
      : null;

    c.ayudante2 = payload.ayudante2Id
      ? await this.medicoRepo.findOneBy({ id: payload.ayudante2Id })
      : null;

    c.tipoCirugia = payload.tipoCirugiaId
      ? await this.tipoRepo.findOneBy({ id: payload.tipoCirugiaId })
      : null;

    return await this.repo.save(c);
  }

  async listar() {
    return await this.repo.find({
      relations: ["paciente", "medicoOperador", "ayudante1", "ayudante2", "tipoCirugia"],
      order: { fecha: "DESC" }
    });
  }
}
