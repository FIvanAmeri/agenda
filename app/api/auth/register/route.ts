import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";

export async function POST(req: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { usuario, email, contrasena }: { usuario: string; email: string; contrasena: string } = await req.json();
    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOne({ 
      where: [{ usuario }, { email }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario o email ya existe" }, 
        { status: 400 }
      );
    }

    const hashedContrasena = await bcrypt.hash(contrasena, 12);
    
    const newUser = userRepo.create({
      usuario,
      email,
      contrasena: hashedContrasena
    });

    await userRepo.save(newUser);

    return NextResponse.json(
      { message: "Usuario creado con éxito" }, 
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}