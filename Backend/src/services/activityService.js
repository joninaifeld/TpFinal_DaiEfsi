import config from '../config/dbconfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class ActivityService {
    logActivity = async (userId, tipoAccion, descripcion, { libroId = null, coleccionId = null } = {}, existingClient = null) => {
        const client = existingClient || new Client(config);
        try {
            if (!existingClient) await client.connect();

            const sql = `
                INSERT INTO actividades (usuario_id, tipo_accion, descripcion, libro_id, coleccion_id, created_at)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
                RETURNING id, tipo_accion, descripcion, libro_id, coleccion_id, created_at;
            `;
            const values = [userId, tipoAccion, descripcion, libroId, coleccionId];
            const result = await client.query(sql, values);

            if (!existingClient) await client.end();
            return result.rows[0];
        } catch (error) {
            if (!existingClient) await client.end();
            console.error(`Error al registrar actividad: ${error.message}`);
            return null;
        }
    }

    getUserActivity = async (userId, limit = 20) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT 
                    a.id,
                    a.tipo_accion,
                    a.descripcion,
                    a.created_at,
                    l.openlibrary_key AS libro_olid,
                    l.titulo AS libro_titulo,
                    l.cover_url AS libro_cover,
                    c.id AS coleccion_id,
                    c.nombre AS coleccion_nombre
                FROM actividades a
                LEFT JOIN libros l ON a.libro_id = l.id
                LEFT JOIN colecciones c ON a.coleccion_id = c.id
                WHERE a.usuario_id = $1
                ORDER BY a.created_at DESC
                LIMIT $2;
            `;
            const result = await client.query(sql, [userId, limit]);
            await client.end();
            return result.rows;
        } catch (error) {
            await client.end();
            throw new Error(`Error al obtener historial de actividad: ${error.message}`);
        }
    }
}