import { Router } from 'express';
import jwt from "jsonwebtoken"
import AuthService from '../services/authService.js';
import { validateUser } from "../middlewares/valUser.js";
import { validateRegister } from '../middlewares/valRegister.js';
import bcrypt from "bcrypt";

const router = Router();
const svc = new AuthService();

const SECRET_KEY = process.env.JWT_SECRET; 

router.post('/register', validateRegister, async (req, res) => {
  const { username , email, password, avatar_url, bio, created_at } = req.body;
  
  try {
    const userExists = await svc.valUserExist(username, email);
    if (userExists) {
      return res.status(400).json({ error: 'El nombre de usuario o el correo electrónico ya están en uso' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await svc.createAsync({
      ...req.body,
      password_hash: hashedPassword
    });

    return res.status(201).json({ 
        message: 'Usuario registrado con éxito', 
        user: nuevoUsuario.username,
        email: nuevoUsuario.email,
        avatar: avatar_url,
        bio: bio,
        creation: created_at
    });
  } catch (error) {
    console.error("Error original:", error);
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        detalle: error.message
      }); 
    }
});

router.post('/login', validateUser, async (req, res) => {
  const { username, password } = req.body;

  try { 
    const user = await svc.getUserAsync(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordCorrecta = await bcrypt.compare(password, user.password_hash);

    if (username === user.username && passwordCorrecta) {
      
      const payload = {
        id: user.id,
        username: user.username,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

      return res.status(200).json({ 
        message: 'Login successful', 
        token: token,   
        id: user.id,
        username: user.username,
        email: user.email, 
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;