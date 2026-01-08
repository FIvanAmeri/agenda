import { NextResponse } from "next/server";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.token as string;
    const newContrasena = body.newContrasena as string;

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ resetToken: token });

    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 });
    }

    const ahora = new Date();
    const expires = user.resetTokenExpires ? new Date(user.resetTokenExpires) : null;

    if (!expires || expires < ahora) {
      return NextResponse.json({ error: "Token expirado" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(newContrasena, salt);

    await repo.update(user.id, {
      contrasena: hashed,
      resetToken: null,
      resetTokenExpires: null
    });

    return NextResponse.json({ message: "Éxito" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fatal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}