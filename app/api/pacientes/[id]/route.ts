import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/app/lib/auth";
import { PacientesRepository } from "@/app/repositories/pacientes.repo";
import { Paciente } from "@/app/entities/paciente.entity";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }
        
        verifyAuthHeader(authHeader);
        const body = await req.json();
        
        const resolvedParams = await params;
        const idId = parseInt(resolvedParams.id, 10);

        if (isNaN(idId)) {
            return NextResponse.json({ message: "ID de paciente inválido" }, { status: 400 });
        }

        const pacientesRepo = new PacientesRepository();

        if (body.estadoPago !== undefined && body.monto !== undefined) {
            const actualizado = await pacientesRepo.actualizarPago(
                idId,
                body.estadoPago,
                parseFloat(body.monto),
                body.fechaPagoParcial || null,
                body.fechaPagoTotal || null
            );

            return NextResponse.json({ 
                message: "Pago actualizado correctamente",
                paciente: actualizado 
            });
        }
        
        const dataParaActualizar: Partial<Paciente> = {};
        
        if (body.paciente !== undefined) dataParaActualizar.paciente = body.paciente;
        if (body.dia !== undefined) dataParaActualizar.dia = body.dia;
        if (body.hora !== undefined) dataParaActualizar.hora = body.hora;
        if (body.practicas !== undefined) dataParaActualizar.practicas = body.practicas;
        if (body.obraSocial !== undefined) dataParaActualizar.obraSocial = body.obraSocial;
        if (body.institucion !== undefined) dataParaActualizar.institucion = body.institucion;
        if (body.fechaNacimiento !== undefined) dataParaActualizar.fechaNacimiento = body.fechaNacimiento;
        if (body.userId !== undefined) dataParaActualizar.userId = parseInt(body.userId, 10);

        if (dataParaActualizar.userId && isNaN(dataParaActualizar.userId)) {
            return NextResponse.json({ message: "userId inválido" }, { status: 400 });
        }

        const actualizado = await pacientesRepo.actualizarPaciente(idId, dataParaActualizar);
        
        return NextResponse.json({ 
            message: "Paciente actualizado",
            paciente: actualizado 
        });

    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error";
        return NextResponse.json({ message: mensaje }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        verifyAuthHeader(authHeader);

        const resolvedParams = await params;
        const idId = parseInt(resolvedParams.id, 10);

        if (isNaN(idId)) {
            return NextResponse.json({ message: "ID de paciente inválido" }, { status: 400 });
        }

        const pacientesRepo = new PacientesRepository();
        const eliminado = await pacientesRepo.eliminarPaciente(idId);

        if (!eliminado) {
            return NextResponse.json({ message: "Paciente no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Paciente eliminado correctamente" }, { status: 200 });

    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error al eliminar";
        return NextResponse.json({ message: mensaje }, { status: 500 });
    }
}