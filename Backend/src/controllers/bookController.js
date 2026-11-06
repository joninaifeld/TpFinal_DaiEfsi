import { Router } from "express";
import OpenLibraryService from "../services/openLibraryService.js";
import BookService from "../services/bookService.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { validaString } from "../helpers/valHelpers.js";

const router = Router();
const olSvc = new OpenLibraryService();
const bookSvc = new BookService();


router.get("/buscar", async (req, res) => {
  const { q, page = 1 } = req.query;

  if (!validaString(q)) {
    return res.status(400).json({ error: "Falta el parámetro q" });
  }

  try {
    const data = await olSvc.searchBooksAsync(q.trim(), Number(page) || 1);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "No se pudo consultar Open Library" });
  }
});

router.get("/:olid", async (req, res) => {
  const { olid } = req.params;

  if (!/^OL\d+W$/.test(olid)) {
    return res.status(400).json({ error: "Identificador inválido" });
  }

  try {
    const libro = await olSvc.getBookAsync(olid);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    return res.status(200).json(libro);
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "No se pudo consultar Open Library" });
  }
});

router.put("/:olid/estado", verifyToken, async (req, res) => {
  const { olid } = req.params;
  const { estado } = req.body;
  const userId = req.user.id;

  const estadosValidos = ['Quiero leer', 'Leyendo', 'Leído', 'Abandonado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado de lectura inválido" });
  }

  try {
    const resultado = await bookSvc.upsertEstado(userId, olid, estado);
    return res.status(200).json({
      message: "Estado de lectura actualizado con éxito",
      data: resultado
    });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:olid/favorito", verifyToken, async (req, res) => {
  const { olid } = req.params;
  const { es_favorito } = req.body;
  const userId = req.user.id;

  if (typeof es_favorito !== 'boolean') {
    return res.status(400).json({ error: "El campo es_favorito debe ser booleano (true/false)" });
  }

  try {
    const resultado = await bookSvc.upsertFavorito(userId, olid, es_favorito);
    return res.status(200).json({
      message: es_favorito ? "Libro marcado como favorito" : "Libro desmarcado de favoritos",
      data: resultado
    });
  } catch (error) {
    console.error("Error al actualizar favorito:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;