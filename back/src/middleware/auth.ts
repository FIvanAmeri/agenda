import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const secret = process.env.JWT_SECRET as string;

  if (!secret) {
    return res.status(500).json({ message: "Error de configuración del servidor (JWT_SECRET no encontrado)" });
  }

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Formato de token inválido (Debe ser 'Bearer <token>')" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, secret) as { 
      userId: number;
    };

    req.user = { userId: decoded.userId }; 

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};