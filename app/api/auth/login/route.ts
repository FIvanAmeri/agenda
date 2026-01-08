import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticateUser } from "@/app/repositories/auth.repo";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";

export async function POST(req: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await req.json();
    const identifier = (body.usuario || body.email || "") as string;
    const contrasena = (body.contrasena || "") as string;

    if (!identifier || !contrasena) {
      return NextResponse.json(
        { error: "Credenciales incompletas" },
        { status: 400 }
      );
    }

    const user: User = await authenticateUser(identifier, contrasena);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Config Error" }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "8h" }
    );

    return NextResponse.json(
      { 
        message: "Login exitoso", 
        user: { id: user.id, usuario: user.usuario, email: user.email }, 
        token 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}