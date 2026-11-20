import ReviewService from '../services/reviewService.js';

const svc = new ReviewService();

router.put('/:olid/resena', verifyToken, async (req, res) => {
  const { olid } = req.params;
  const { puntuacion, resena_texto, titulo, autor, cover_url, genero_principal } = req.body;

  const nota = Number(puntuacion);
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return res.status(400).json({ error: 'La puntuación debe ser un número entero entre 1 y 5' });
  }

  if (resena_texto !== undefined && resena_texto !== null && typeof resena_texto !== 'string') {
    return res.status(400).json({ error: 'El texto de la reseña debe ser una cadena de texto' });
  }

  try {
    const resenaGuardada = await svc.upsertResena(req.user.id, olid.trim(), {
      puntuacion: nota,
      resena_texto,
      bookData: { titulo, autor, cover_url, genero_principal }
    });
    return res.status(200).json({
      message: 'Valoración guardada con éxito',
      resena: resenaGuardada
    });
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    return res.status(500).json({ error: error.message });
  }
});