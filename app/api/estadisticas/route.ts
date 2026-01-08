import { NextRequest, NextResponse } from "next/server";
import { EstadisticasService } from "../../server/estadisticas/estadisticas.service";
import {AppDataSource} from "../../lib/data-source";

const service = new EstadisticasService();

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { searchParams } = new URL(req.url);
        const usuarioId = parseInt(searchParams.get("usuarioId") || "0");
        const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());

        if (!usuarioId) {
            return NextResponse.json({ message: "ID de usuario requerido" }, { status: 400 });
        }

        const stats = await service.obtenerEstadisticasGenerales(usuarioId, anio);
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error detallado en servidor:", error);
        return NextResponse.json(
            { message: "Error al obtener estadísticas", error: error instanceof Error ? error.message : String(error) }, 
            { status: 500 }
        );
    }
}