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
            error.message = `Error al actualizar el perfil del usuario: ${error.message}`;
            throw error;
        }
    }
}