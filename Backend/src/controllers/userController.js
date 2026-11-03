import { Router } from 'express';
import jwt from "jsonwebtoken"
import verifyToken from "../middlewares/authMiddleware.js";
import UserService from '../services/userService.js';
const router = Router();
const svc = new UserService();

router.put('/perfil', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { biografia, foto_perfil, reading_goal_annual } = req.body;

    const updatedUser = await svc.updateUser(userId, { biografia, foto_perfil, reading_goal_annual });
    return res.status(200).json({ 
        message: 'Perfil actualizado con éxito', 
        user: updatedUser 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});


export default router;