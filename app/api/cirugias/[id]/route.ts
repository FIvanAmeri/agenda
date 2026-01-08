import { NextResponse } from "next/server";
import { CirugiaService } from "@/app/server/cirugias/cirugia.service";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _req: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const cirugiaId = Number(id);

        if (isNaN(cirugiaId)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            );
        }

        const service = new CirugiaService();
        const cirugia = await service.obtenerPorId(cirugiaId, 0);

        if (!cirugia) {
            return NextResponse.json(
                { error: "Cirugía no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(cirugia);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const cirugiaId = Number(id);

        if (isNaN(cirugiaId)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { usuarioId, ...updateData } = body;

        if (!usuarioId) {
            return NextResponse.json(
                { error: "usuarioId requerido" },
                { status: 400 }
            );
        }

        const service = new CirugiaService();
        const updated = await service.actualizar(
            cirugiaId,
            usuarioId,
            updateData
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const cirugiaId = Number(id);

        if (isNaN(cirugiaId)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            );
        }

        
        const { searchParams } = new URL(req.url);
        const usuarioId = Number(searchParams.get("usuarioId"));

        if (!usuarioId) {
            return NextResponse.json(
                { error: "usuarioId es requerido para eliminar" },
                { status: 400 }
            );
        }

        const service = new CirugiaService();
        
        await service.eliminar(cirugiaId, usuarioId);

        return NextResponse.json({ message: "Eliminado correctamente" }, { status: 200 });
    } catch (error) {
        console.error("Error en DELETE route:", error);
        return NextResponse.json(
            { error: "Error interno al eliminar" },
            { status: 500 }
        );
    }
}