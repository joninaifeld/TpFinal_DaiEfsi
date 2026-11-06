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

router.post("/:id/libros", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const coleccionId = req.params.id;
  const { olid } = req.body;

  if (!validaString(olid)) {
    return res.status(400).json({ error: "El identificador del libro (olid) es obligatorio" });
  }

  try {
    const olidLimpio = olid.trim();

    const yaExisteEnColeccion = await svc.isBookInColeccion(coleccionId, olidLimpio);
    if (yaExisteEnColeccion) {
      return res.status(400).json({ error: "El libro ya se encuentra en esta colección." });
    }

    const resultado = await svc.addBookToColeccion(coleccionId, olid.trim(), userId);
    return res.status(201).json({
      message: "Libro agregado a la colección con éxito",
      data: resultado
    });
  } catch (error) {
    console.error("Error al agregar libro a colección:", error);
    const status = error.message.includes('no encontrada') ? 404 : 400;
    return res.status(status).json({ error: error.message });
  }
});

router.delete("/:id/libros/:olid", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const coleccionId = req.params.id;
  const { olid } = req.params;

  if (!validaString(olid)) {
    return res.status(400).json({ error: "El identificador del libro (olid) es obligatorio" });
  }

  try {
    const olidLimpio = olid.trim();

    const yaExisteEnColeccion = await svc.isBookInColeccion(coleccionId, olidLimpio);
    if (!yaExisteEnColeccion) {
      return res.status(404).json({ error: "El libro no se encuentra en esta colección." });
    }

    await svc.removeBookFromColeccion(coleccionId, olidLimpio, userId);
    return res.status(200).json({
      message: "Libro eliminado de la colección con éxito"
    });
  } catch (error) {
    console.error("Error al eliminar libro de colección:", error);
    const status = error.message.includes('no encontrada') ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const coleccionId = req.params.id;
  const { nombre, descripcion } = req.body;

  if (nombre !== undefined && !validaString(nombre)) {
    return res.status(400).json({ error: "El nombre de la colección no puede estar vacío" });
  }

  try {
    const nombreLimpio = nombre ? nombre.trim() : undefined;

    if (nombreLimpio) {
      const coleccionExistente = await svc.getColeccionByName(userId, nombreLimpio);
      if (coleccionExistente && coleccionExistente.id != coleccionId) {
        return res.status(400).json({ error: "Ya tienes otra colección con ese nombre." });
      }
    }

    const coleccionActualizada = await svc.updateColeccion(
      coleccionId, 
      userId, 
      nombreLimpio, 
      descripcion
    );

    return res.status(200).json({
      message: "Colección actualizada con éxito",
      coleccion: coleccionActualizada
    });
  } catch (error) {
    console.error("Error al actualizar colección:", error);
    const status = error.message.includes('no encontrada') ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
});

export default router;