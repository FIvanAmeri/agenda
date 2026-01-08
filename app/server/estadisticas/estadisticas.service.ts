import {AppDataSource} from "../../lib/data-source";
import { Paciente, EstadoPago } from "../../entities/paciente.entity";

interface DetalleEstadistica {
    cantidad: number;
    pacientes: string[];
}

interface PagoDetallado {
    fecha: string;
    monto: number;
    paciente: string;
    institucion: string;
}

interface ResumenMensual {
    monto: number;
    pacientes: string[];
}

export class EstadisticasService {
    private get repo() {
        return AppDataSource.getRepository(Paciente);
    }

    async obtenerEstadisticasGenerales(userId: number, anio: number) {
        const todosLosPacientes = await this.repo.find({
            where: { userId },
            order: { id: "DESC" }
        });

        const pacientesDelAnio = todosLosPacientes.filter(p => {
            const fechaRef = p.fechaPagoTotal || p.fechaPagoParcial || p.dia;
            if (!fechaRef) return false;
            const fecha = new Date(fechaRef);
            return !isNaN(fecha.getTime()) && fecha.getFullYear() === anio;
        });

        const pacientesPagadosAnio = pacientesDelAnio.filter(p => 
            p.estadoPago === EstadoPago.PAGADO || p.estadoPago === EstadoPago.PARCIALMENTE_PAGADO
        );

        const pacientesNoPagadosAnio = pacientesDelAnio.filter(p => 
            p.estadoPago === EstadoPago.NO_PAGADO
        );

        return {
            resumenPagos: this.calcularPagosMensuales(pacientesPagadosAnio),
            distribucionEdades: this.calcularRangosEtarios(pacientesDelAnio),
            porObraSocial: this.agruparPorObraSocial(pacientesDelAnio),
            metricasPracticas: this.analizarPracticas(pacientesPagadosAnio),
            metricasNoPagados: this.analizarPracticas(pacientesNoPagadosAnio),
            pagosDetallados: this.mapearPagosDetallados(pacientesPagadosAnio)
        };
    }

    private mapearPagosDetallados(pacientes: Paciente[]): PagoDetallado[] {
        return pacientes.map(p => ({
            fecha: String(p.fechaPagoTotal || p.fechaPagoParcial || p.dia),
            monto: Number(p.montoPagado) || 0,
            paciente: p.paciente,
            institucion: p.institucion || "Sin Institución"
        }));
    }

    private calcularPagosMensuales(pacientes: Paciente[]) {
        const meses = Array(12).fill(null).map(() => ({ monto: 0, pacientes: [] as string[] }));
        let totalAnual = 0;

        pacientes.forEach(p => {
            const monto = Number(p.montoPagado) || 0;
            const fechaRef = p.fechaPagoTotal || p.fechaPagoParcial || p.dia;
            if (fechaRef) {
                const fecha = new Date(fechaRef);
                if (!isNaN(fecha.getTime())) {
                    const mesIndex = fecha.getMonth();
                    meses[mesIndex].monto += monto;
                    meses[mesIndex].pacientes.push(`${p.paciente} ($${monto.toLocaleString()})`);
                    totalAnual += monto;
                }
            }
        });

        return {
            mensuales: meses.map(m => ({
                monto: Math.round(m.monto * 100) / 100,
                pacientes: m.pacientes
            })),
            totalAnual: Math.round(totalAnual * 100) / 100
        };
    }

    private calcularRangosEtarios(pacientes: Paciente[]) {
        const rangos: Record<string, DetalleEstadistica> = {
            "18-20": { cantidad: 0, pacientes: [] },
            "21-30": { cantidad: 0, pacientes: [] },
            "31-40": { cantidad: 0, pacientes: [] },
            "41-50": { cantidad: 0, pacientes: [] },
            "51-60": { cantidad: 0, pacientes: [] },
            "61-70": { cantidad: 0, pacientes: [] },
            "71-80": { cantidad: 0, pacientes: [] },
            "81-90": { cantidad: 0, pacientes: [] },
            "91-100": { cantidad: 0, pacientes: [] }
        };

        pacientes.forEach(p => {
            if (p.fechaNacimiento) {
                const edad = this.calcularEdad(p.fechaNacimiento);
                let rango = "";
                if (edad >= 18 && edad <= 20) rango = "18-20";
                else if (edad >= 21 && edad <= 30) rango = "21-30";
                else if (edad >= 31 && edad <= 40) rango = "31-40";
                else if (edad >= 41 && edad <= 50) rango = "41-50";
                else if (edad >= 51 && edad <= 60) rango = "51-60";
                else if (edad >= 61 && edad <= 70) rango = "61-70";
                else if (edad >= 71 && edad <= 80) rango = "71-80";
                else if (edad >= 81 && edad <= 90) rango = "81-90";
                else if (edad >= 91 && edad <= 100) rango = "91-100";

                if (rango && rangos[rango]) {
                    rangos[rango].cantidad++;
                    rangos[rango].pacientes.push(`${p.paciente} (${edad} años)`);
                }
            }
        });
        return rangos;
    }

    private agruparPorObraSocial(pacientes: Paciente[]) {
        const obras: Record<string, DetalleEstadistica> = {};
        pacientes.forEach(p => {
            const nombre = p.obraSocial || "Particular";
            if (!obras[nombre]) obras[nombre] = { cantidad: 0, pacientes: [] };
            obras[nombre].cantidad++;
            obras[nombre].pacientes.push(`${p.paciente} (${p.estadoPago})`);
        });
        return obras;
    }

    private analizarPracticas(pacientes: Paciente[]) {
        const conteo: Record<string, DetalleEstadistica> = {};
        pacientes.forEach(p => {
            const institucion = p.institucion || "Sin Institución";
            const texto = (p.practicas || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let tipo = "Consulta General";
            if (texto.includes("urodinamia") || texto.includes("urodinamico")) tipo = "Estudio Urodinámico";
            else if (texto.includes("flujometria")) tipo = "Flujometría";
            const clave = `${institucion} - ${tipo}`;
            if (!conteo[clave]) conteo[clave] = { cantidad: 0, pacientes: [] };
            conteo[clave].cantidad++;
            conteo[clave].pacientes.push(`${p.paciente} (${institucion})`);
        });
        return conteo;
    }

    private calcularEdad(fechaNacimiento: string | Date): number {
        const hoy = new Date();
        const cumple = new Date(fechaNacimiento);
        if (isNaN(cumple.getTime())) return 0;
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
        return edad;
    }
}