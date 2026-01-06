import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticateUser } from "@/app/repositories/auth.repo";
import { AppDataSource } from "@/app/lib/data-source";

export async function POST(req: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await req.json();

    if (!body.usuario || !body.contrasena) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(body.usuario, body.contrasena);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no configurado.");
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "8h" }
    );

    const { contrasena, ...userWithoutPass } = user;

    return NextResponse.json(
      { message: "Usuario autenticado", user: userWithoutPass, token },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}