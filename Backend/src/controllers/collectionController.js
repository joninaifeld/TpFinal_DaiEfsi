import { Router } from "express";
import CollectionService from "../services/collectionService.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { validaString } from "../helpers/valHelpers.js";

const router = Router();
const svc = new CollectionService();

router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { nombre, descripcion } = req.body;

  if (!validaString(nombre)) {
    return res.status(400).json({ error: "El nombre de la colección es obligatorio" });
  }

  try {
    const nombreLimpio = nombre.trim();

    const coleccionExistente = await svc.getColeccionByName(userId, nombreLimpio);
    if (coleccionExistente) {
      return res.status(400).json({ error: "Ya tienes una colección con ese nombre." });
    }

    const nuevaColeccion = await svc.createColeccion(userId, nombreLimpio, descripcion);
    return res.status(201).json({
      message: "Colección creada con éxito",
      coleccion: nuevaColeccion
    });
  } catch (error) {
    console.error("Error al crear colección:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;