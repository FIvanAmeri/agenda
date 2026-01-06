import { NextRequest, NextResponse } from "next/server";
import { CirugiaService } from "../../../server/cirugias/cirugia.service";

const service = new CirugiaService();

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const body = await req.json();
        const { usuarioId, ...updateData } = body;

        if (!usuarioId) {
            return NextResponse.json({ message: "Usuario ID requerido" }, { status: 400 });
        }

        const actualizada = await service.actualizar(id, usuarioId, updateData);
        return NextResponse.json(actualizada);
    } catch (error) {
        return NextResponse.json({ message: "Error al actualizar la cirugía" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const { searchParams } = new URL(req.url);
        const usuarioId = parseInt(searchParams.get("usuarioId") || "0");

        if (!usuarioId) {
            return NextResponse.json({ message: "Usuario ID requerido" }, { status: 400 });
        }

        await service.eliminar(id, usuarioId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: "Error al eliminar la cirugía" }, { status: 500 });
    }
}