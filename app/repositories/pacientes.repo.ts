import { AppDataSource } from "../lib/data-source";
import { Paciente } from "../entities/paciente.entity";
import { Repository } from "typeorm";

export class PacientesRepository {
    private async getRepo(): Promise<Repository<Paciente>> {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        return AppDataSource.getRepository(Paciente);
    }

    async obtenerPacientes(userId: number): Promise<Paciente[]> {
        const repo = await this.getRepo();
        return await repo.find({
            where: { userId },
            order: { dia: "ASC", hora: "ASC" }
        });
    }

    async crearPaciente(data: Partial<Paciente>): Promise<Paciente> {
        const repo = await this.getRepo();
        const nuevoPaciente = repo.create(data);
        return await repo.save(nuevoPaciente);
    }

    async actualizarPaciente(id: number, data: Partial<Paciente>): Promise<Paciente | null> {
        const repo = await this.getRepo();
        const existe = await repo.findOneBy({ id });
        
        if (!existe) {
            throw new Error("Paciente no encontrado");
        }

        await repo.update(id, data);
        return await repo.findOneBy({ id });
    }

    async eliminarPaciente(id: number): Promise<boolean> {
        const repo = await this.getRepo();
        const resultado = await repo.delete(id);
        return resultado.affected !== 0;
    }
}