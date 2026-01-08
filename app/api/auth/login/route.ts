import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticateUser } from "@/app/repositories/auth.repo";
import { AppDataSource } from "@/app/lib/data-source";

export async function POST(req: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const rawBody = await req.json();
    const usuario = rawBody.usuario || rawBody.Usuario || rawBody.identifier;
    const contrasena = rawBody.contrasena || rawBody.Contrasena || rawBody.password;

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { error: "Faltan credenciales en el body" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(usuario, contrasena);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "8h" }
    );

    return NextResponse.json(
      { 
        message: "Usuario autenticado", 
        user: { id: user.id, usuario: user.usuario, email: user.email }, 
        token 
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}