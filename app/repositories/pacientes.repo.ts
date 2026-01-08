import { AppDataSource } from "../lib/data-source";
import { Paciente, EstadoPago } from "../entities/paciente.entity";
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

    async actualizarPago(
        id: number, 
        estadoPago: string, 
        montoNuevo: number, 
        fechaParcial: string | null, 
        fechaTotal: string | null
    ): Promise<Paciente | null> {
        const repo = await this.getRepo();
        const paciente = await repo.findOneBy({ id });

        if (!paciente) {
            throw new Error("Paciente no encontrado");
        }

        const montoAnterior = paciente.montoPagado ? Number(paciente.montoPagado) : 0;
        const montoAcumulado = montoAnterior + Number(montoNuevo);

        const updates: Partial<Paciente> = {
            estadoPago: estadoPago as EstadoPago,
            montoPagado: estadoPago === 'no pagado' ? 0 : montoAcumulado,
        };

        if (fechaParcial) {
            updates.fechaPagoParcial = fechaParcial;
        }

        if (fechaTotal) {
            updates.fechaPagoTotal = fechaTotal;
        }

        if (estadoPago === 'no pagado') {
            updates.fechaPagoParcial = null;
            updates.fechaPagoTotal = null;
        }

        await repo.update(id, updates);
        return await repo.findOneBy({ id });
    }

    async eliminarPaciente(id: number): Promise<boolean> {
        const repo = await this.getRepo();
        const resultado = await repo.delete(id);
        return resultado.affected !== 0;
    }
}