import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/app/lib/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        
        verifyAuthHeader(authHeader);

        const body: { tipo: string; nombre: string } = await req.json();
        const { tipo, nombre } = body;

        if (!tipo || !nombre) {
            return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
        }

        return NextResponse.json({ message: "OK", data: { tipo, nombre } }, { status: 201 });
    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error";
        return NextResponse.json({ message: mensaje }, { status: 500 });
    }
}