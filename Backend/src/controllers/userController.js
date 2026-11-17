import { Router } from 'express';
import jwt from "jsonwebtoken"
import verifyToken from "../middlewares/authMiddleware.js";
import UserService from '../services/userService.js';
import ActivityService from '../services/activityService.js';

const router = Router();
const svc = new UserService();
const activitySvc = new ActivityService();

router.put('/perfil', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { biografia, foto_perfil, reading_goal_annual } = req.body;

    const updatedUser = await svc.updateUser(userId, { bio: biografia, avatar_url: foto_perfil, reading_goal_annual });
    return res.status(200).json({ 
        message: 'Perfil actualizado con éxito', 
        user: updatedUser 
    });
  } catch (error) {
    return (
        res.status(500).json({ error: 'Error al actualizar el perfil' }),
        console.error("Error al actualizar perfil:", error)
    );
  }
});

router.get('/actividad', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 20;

    const actividades = await activitySvc.getUserActivity(userId, limit);
    return res.status(200).json(actividades);
  } catch (error) {
    console.error("Error al obtener actividad:", error);
    return res.status(500).json({ error: error.message });
  }
}); 


export default router;