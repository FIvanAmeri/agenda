import { NextRequest, NextResponse } from "next/server";
import { CirugiaService } from "../../../server/cirugias/cirugia.service";

const service = new CirugiaService();

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const usuarioId = parseInt(searchParams.get("usuarioId") || "0");
    if (!usuarioId) return NextResponse.json({ message: "ID requerido" }, { status: 400 });

    try {
        const tiposCirugia = await service.obtenerTiposCirugiaUnicos(usuarioId);
        return NextResponse.json({ tiposCirugia });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}