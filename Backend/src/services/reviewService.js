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

    getResenasByOlid = async (olid) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT 
                    vr.id,
                    vr.puntuacion,
                    vr.resena_texto,
                    vr.created_at,
                    u.id AS usuario_id,
                    u.username,
                    u.avatar_url
                FROM valoraciones_resenas vr
                JOIN libros l ON vr.libro_id = l.id
                JOIN usuarios u ON vr.usuario_id = u.id
                WHERE l.openlibrary_key = $1
                ORDER BY vr.created_at DESC;
            `;
            const result = await client.query(sql, [olid]);
            await client.end();

            const resenas = result.rows;
            const total = resenas.length;
            const promedio = total > 0
                ? Number((resenas.reduce((acc, r) => acc + r.puntuacion, 0) / total).toFixed(2))
                : null;

            return {
                promedio_puntuacion: promedio,
                total_valoraciones: total,
                resenas
            };
        } catch (error) {
            await client.end();
            throw new Error(`Error al obtener reseñas del libro: ${error.message}`);
        }
    }

    deleteResena = async (userId, olid) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                DELETE FROM valoraciones_resenas vr
                USING libros l
                WHERE vr.libro_id = l.id
                  AND vr.usuario_id = $1
                  AND l.openlibrary_key = $2
                RETURNING vr.id, l.titulo;
            `;
            const result = await client.query(sql, [userId, olid]);

            if (result.rows.length > 0) {
                await activityService.logActivity(
                    userId,
                    'resena',
                    `Eliminó su reseña de "${result.rows[0].titulo}"`,
                    {},
                    client
                );
            }

            await client.end();
            return result.rows[0] || null;
        } catch (error) {
            await client.end();
            throw new Error(`Error al eliminar la reseña: ${error.message}`);
        }
    }

    getUserResenas = async (userId) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT 
                    vr.id,
                    vr.puntuacion,
                    vr.resena_texto,
                    vr.created_at,
                    l.id AS libro_id,
                    l.openlibrary_key,
                    l.titulo,
                    l.autor,
                    l.cover_url,
                    l.genero_principal
                FROM valoraciones_resenas vr
                JOIN libros l ON vr.libro_id = l.id
                WHERE vr.usuario_id = $1
                ORDER BY vr.created_at DESC;
            `;
            const result = await client.query(sql, [userId]);
            await client.end();
            return result.rows;
        } catch (error) {
            await client.end();
            throw new Error(`Error al obtener reseñas del usuario: ${error.message}`);
        }
    }
}