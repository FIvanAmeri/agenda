import express from 'express';
import { createUser } from '../services/userService';
import { authenticateUser } from '../services/authService';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.use((req, res, next) => {
  console.log("HEADERS ->", req.headers);
  console.log("AUTHORIZATION ->", req.headers.authorization);
  next();
});

router.post('/register', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const newUser = await createUser(usuario, contrasena);
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const user = await authenticateUser(usuario, contrasena);
    
    const secret = process.env.JWT_SECRET as string; 
    
    if (!secret) {
      throw new Error("JWT_SECRET no configurado.");
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '8h' });

    res.status(200).json({ message: 'Usuario autenticado', user, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
});

export default router;