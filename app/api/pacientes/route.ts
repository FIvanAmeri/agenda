import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/app/lib/auth";
import { PacientesRepository } from "@/app/repositories/pacientes.repo";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        
        const { userId } = verifyAuthHeader(authHeader);
        const pacientesRepo = new PacientesRepository();
        const pacientes = await pacientesRepo.obtenerPacientes(userId);
        
        return NextResponse.json({ pacientes: Array.isArray(pacientes) ? pacientes : [] });
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        
        verifyAuthHeader(authHeader);
        const body = await req.json();
        const pacientesRepo = new PacientesRepository();
        const nuevoPaciente = await pacientesRepo.crearPaciente(body);
        
        return NextResponse.json({ paciente: nuevoPaciente }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Error" }, { status: 500 });
    }
}