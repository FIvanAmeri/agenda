import { NextRequest, NextResponse } from "next/server";
import { CirugiaService } from "../../server/cirugias/cirugia.service";

const service = new CirugiaService();

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const usuarioId = parseInt(searchParams.get("usuarioId") || "0");
    if (!usuarioId) {
        return NextResponse.json({ message: "ID de usuario requerido" }, { status: 400 });
    }

    const filters = {
        usuarioId,
        dateFrom: searchParams.get("dateFrom") || undefined,
        dateTo: searchParams.get("dateTo") || undefined,
        paciente: searchParams.get("paciente") || undefined,
        tipoCirugia: searchParams.get("tipoCirugia") || undefined,
        medico: searchParams.get("medico") || undefined,
        estadoPago: (searchParams.get("estadoPago") as "pagado" | "no pagado" | "parcialmente pagado") || undefined,
    };

    try {
        const cirugias = await service.listar(filters);
        return NextResponse.json({ data: cirugias });
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener cirugías" }, { status: 500 });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        if (!body.usuarioId) {
            return NextResponse.json({ message: "El usuarioId es obligatorio" }, { status: 400 });
        }
        const nuevaCirugia = await service.crear(body);
        return NextResponse.json(nuevaCirugia, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error al crear la cirugía" }, { status: 500 });
    }
}