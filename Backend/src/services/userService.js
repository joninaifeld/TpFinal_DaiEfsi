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
}