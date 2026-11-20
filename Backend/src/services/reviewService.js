import config from '../config/dbconfig.js';
import pkg from 'pg';
import ActivityService from './activityService.js';

const { Client } = pkg;
const activityService = new ActivityService();

export default class ReviewService {
    upsertResena = async (userId, olid, { puntuacion, resena_texto = null, bookData = {} }) => {
        const client = new Client(config);
        try {
            await client.connect();

            let libroRes = await client.query(
                `SELECT id, titulo FROM libros WHERE openlibrary_key = $1`,
                [olid]
            );
            let libroId;
            let tituloLibro;

            if (libroRes.rows.length > 0) {
                libroId = libroRes.rows[0].id;
                tituloLibro = libroRes.rows[0].titulo;
            } else {
                const { titulo, autor, cover_url, genero_principal } = bookData;
                if (!titulo) {
                    await client.end();
                    throw new Error("El libro no existe en la base local y falta 'titulo' para registrarlo.");
                }
                const insertLibro = await client.query(
                    `INSERT INTO libros (openlibrary_key, titulo, autor, cover_url, genero_principal)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING id, titulo;`,
                    [olid, titulo, autor || null, cover_url || null, genero_principal || null]
                );
                libroId = insertLibro.rows[0].id;
                tituloLibro = insertLibro.rows[0].titulo;
            }

            const prevRes = await client.query(
                `SELECT id FROM valoraciones_resenas WHERE usuario_id = $1 AND libro_id = $2`,
                [userId, libroId]
            );
            const esEdicion = prevRes.rows.length > 0;

            const textoLimpio = (resena_texto && resena_texto.trim() !== '') ? resena_texto.trim() : null;
            const upsertSql = `
                INSERT INTO valoraciones_resenas (usuario_id, libro_id, puntuacion, resena_texto, created_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                ON CONFLICT (usuario_id, libro_id)
                DO UPDATE SET
                    puntuacion = EXCLUDED.puntuacion,
                    resena_texto = EXCLUDED.resena_texto,
                    created_at = CURRENT_TIMESTAMP
                RETURNING id, usuario_id, libro_id, puntuacion, resena_texto, created_at;
            `;
            const result = await client.query(upsertSql, [userId, libroId, puntuacion, textoLimpio]);

            const accionTexto = esEdicion
                ? `Editó su valoración (${puntuacion}★) de "${tituloLibro}"`
                : `Puntuó "${tituloLibro}" con ${puntuacion}★`;

            await activityService.logActivity(
                userId,
                'resena',
                accionTexto,
                { libroId },
                client
            );

            await client.end();
            return result.rows[0];
        } catch (error) {
            await client.end();
            throw new Error(`Error al guardar valoración/reseña: ${error.message}`);
        }
    }


}