import { Router } from "express";
import OpenLibraryService from "../services/openLibraryService.js";
import { validaString } from "../helpers/valHelpers.js";

const router = Router();
const svc = new OpenLibraryService();

router.get("/buscar", async (req, res) => {
  const { q, page = 1 } = req.query;

  if (!validaString(q)) {
    return res.status(400).json({ error: "Falta el parámetro q" });
  }

  try {
    const data = await svc.searchBooksAsync(q.trim(), Number(page) || 1);
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
    const libro = await svc.getBookAsync(olid);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    return res.status(200).json(libro);
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "No se pudo consultar Open Library" });
  }
});

export default router;