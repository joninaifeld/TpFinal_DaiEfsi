import config from '../config/dbconfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class UserService {
    updateUser = async (userId, data) => {
        const client = new Client(config);
        const { bio, avatar_url, reading_goal_annual } = data;
        try {
            await client.connect();
            const sql = `
                UPDATE "usuarios" SET bio = COALESCE($1, bio), 
                    avatar_url = COALESCE($2, avatar_url),
                    reading_goal_annual = COALESCE($3, reading_goal_annual)
                WHERE id = $4
                RETURNING id, username, email, avatar_url, bio, reading_goal_annual;
            `;
            const result = await client.query(sql, [bio, avatar_url, reading_goal_annual, userId]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            await client.end();
            error.message = `Error al actualizar el perfil del usuario: ${error.message}`;
            throw error;
        }
    }

    getUserLibros = async (userId, { estado = null, soloFavoritos = false } = {}) => {
        const client = new Client(config);
        try {
            await client.connect();

            const conditions = ['el.usuario_id = $1'];
            const values = [userId];

            if (estado) {
                values.push(estado);
                conditions.push(`el.estado = $${values.length}`);
            }

            if (soloFavoritos) {
                conditions.push(`el.es_favorito = true`);
            }

            const sql = `
                SELECT 
                    l.id,
                    l.openlibrary_key,
                    l.titulo,
                    l.autor,
                    l.cover_url,
                    l.genero_principal,
                    el.estado,
                    el.es_favorito,
                    el.updated_at
                FROM estado_lectura el
                JOIN libros l ON el.libro_id = l.id
                WHERE ${conditions.join(' AND ')}
                ORDER BY el.updated_at DESC;
            `;

            const result = await client.query(sql, values);
            await client.end();
            return result.rows;
        } catch (error) {
            await client.end();
            throw new Error(`Error al obtener los libros del usuario: ${error.message}`);
        }
    }

    getUserStats = async (userId) => {
        const client = new Client(config);
        try {
            await client.connect();

            const goalRes = await client.query(
                `SELECT COALESCE(reading_goal_annual, 0)::int AS reading_goal_annual FROM "usuarios" WHERE id = $1;`,
                [userId]
            );
            if (goalRes.rows.length === 0) {
                await client.end();
                return null;
            }
            const readingGoalAnnual = goalRes.rows[0].reading_goal_annual;

            const estadosRes = await client.query(
                `
                SELECT
                    COUNT(*) FILTER (WHERE estado = 'Quiero leer')::int AS quiero_leer,
                    COUNT(*) FILTER (WHERE estado = 'Leyendo')::int AS leyendo,
                    COUNT(*) FILTER (WHERE estado = 'Leído')::int AS leidos,
                    COUNT(*) FILTER (WHERE estado = 'Abandonado')::int AS abandonados,
                    COUNT(*) FILTER (WHERE es_favorito = true)::int AS favoritos,
                    COUNT(*)::int AS total_interacciones
                FROM estado_lectura
                WHERE usuario_id = $1;
                `,
                [userId]
            );
            const statsEstados = estadosRes.rows[0];

            const colRes = await client.query(
                `
                SELECT
                    COUNT(DISTINCT c.id)::int AS total_colecciones,
                    COUNT(cl.libro_id)::int AS libros_en_colecciones
                FROM colecciones c
                LEFT JOIN coleccion_libros cl ON c.id = cl.coleccion_id
                WHERE c.usuario_id = $1;
                `,
                [userId]
            );
            const statsColecciones = colRes.rows[0];

            const generosRes = await client.query(
                `
                SELECT
                    l.genero_principal AS genero,
                    COUNT(*)::int AS cantidad
                FROM estado_lectura el
                JOIN libros l ON el.libro_id = l.id
                WHERE el.usuario_id = $1
                  AND l.genero_principal IS NOT NULL
                  AND TRIM(l.genero_principal) <> ''
                GROUP BY l.genero_principal
                ORDER BY cantidad DESC, l.genero_principal ASC
                LIMIT 5;
                `,
                [userId]
            );

            const resenasRes = await client.query(
                `
                SELECT
                    COUNT(*)::int AS total_valoraciones,
                    COUNT(*) FILTER (WHERE resena_texto IS NOT NULL AND TRIM(resena_texto) <> '')::int AS total_resenas,
                    ROUND(AVG(puntuacion)::numeric, 2) AS puntuacion_promedio
                FROM valoraciones_resenas
                WHERE usuario_id = $1;
                `,
                [userId]
            );
            const statsResenas = resenasRes.rows[0];

            await client.end();

            const librosLeidos = statsEstados.leidos;
            const porcentajeObjetivo = readingGoalAnnual > 0
                ? Math.min(100, Math.round((librosLeidos / readingGoalAnnual) * 100))
                : 0;

            return {
                reading_challenge: {
                    libros_leidos: librosLeidos,
                    objetivo_anual: readingGoalAnnual,
                    porcentaje_cumplido: porcentajeObjetivo
                },
                estados: {
                    'Quiero leer': statsEstados.quiero_leer,
                    'Leyendo': statsEstados.leyendo,
                    'Leído': statsEstados.leidos,
                    'Abandonado': statsEstados.abandonados
                },
                total_favoritos: statsEstados.favoritos,
                total_interacciones: statsEstados.total_interacciones,
                colecciones: {
                    total_colecciones: statsColecciones.total_colecciones,
                    libros_en_colecciones: statsColecciones.libros_en_colecciones
                },
                generos_mas_frecuentes: generosRes.rows,
                valoraciones: {
                    total_valoraciones: statsResenas.total_valoraciones,
                    total_resenas: statsResenas.total_resenas,
                    puntuacion_promedio: statsResenas.puntuacion_promedio ? Number(statsResenas.puntuacion_promedio) : null
                }
            };
        } catch (error) {
            await client.end();
            throw new Error(`Error al calcular estadísticas del usuario: ${error.message}`);
        }
    }
}