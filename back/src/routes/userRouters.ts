import express from 'express';
import { createUser } from '../services/userService';
import { authenticateUser } from '../services/authService';

const router = express.Router();

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
    res.status(200).json({ message: 'Usuario autenticado', user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido' }); 
    }
  }
});

export default router;
