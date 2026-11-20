import { Router } from 'express';
import jwt from "jsonwebtoken"
import verifyToken from "../middlewares/authMiddleware.js";
import UserService from '../services/userService.js';
import ActivityService from '../services/activityService.js';
import ReviewService from '../services/reviewService.js';

const router = Router();
const svc = new UserService();
const activitySvc = new ActivityService();
const reviewSvc = new ReviewService();

router.get('/perfil', verifyToken, async (req, res) => {
  try {
    const user = await svc.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ error: error.message });
  }
});

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

router.get('/libros', verifyToken, async (req, res) => {
  const { estado, favoritos } = req.query;

  const estadosValidos = ['Quiero leer', 'Leyendo', 'Leído', 'Abandonado'];
  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado de lectura inválido" });
  }

  try {
    const soloFavoritos = favoritos === 'true';
    const libros = await svc.getUserLibros(req.user.id, { estado, soloFavoritos });
    return res.status(200).json(libros);
  } catch (error) {
    console.error("Error al obtener libros del usuario:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/estadisticas', verifyToken, async (req, res) => {
  try {
    const stats = await svc.getUserStats(req.user.id);
    if (!stats) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/resenas', verifyToken, async (req, res) => {
  try {
    const resenas = await reviewSvc.getUserResenas(req.user.id);
    return res.status(200).json(resenas);
  } catch (error) {
    console.error("Error al obtener reseñas del usuario:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;