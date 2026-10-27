import config from '../config/dbconfig.js';
import pkg from 'pg'
const { Client } = pkg;

export default class AuthService {
    getUserAsync = async (username) => {
        let returnArray = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * FROM "usuarios" WHERE username = $1`;
            const result = await client.query(sql, [username]);
            await client.end();
            returnArray = (result.rows && result.rows.length > 0) ? result.rows[0] : null;
        } catch (error) {
            error.message = `Error al obtener el usuario por nombre de usuario: ${error.message}`;
        }
        return returnArray;
    }

    valUserExist = async (username, email) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT id FROM "usuarios" WHERE username = $1 OR email = $2`;
            const result = await client.query(sql, [username, email]);
            await client.end();
            return result.rowCount > 0;
        } catch (error) {
            error.message = `Error al verificar la existencia del usuario: ${error.message}`;
            throw error; 
        }
    }

    createAsync = async (userData) => {
        const client = new Client(config);
        const { username , email, password_hash, avatar_url, bio, created_at  } = userData; 
        try {
            await client.connect();
            const sql = `
                INSERT INTO "usuarios" (username , email, password_hash, avatar_url, bio, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, username, email; 
            `;
            const values = [username , email, password_hash, avatar_url, bio, created_at];
            const result = await client.query(sql, values);
            await client.end();
            return result.rows[0];

        } catch (error) {
            error.message = `Error al crear el usuario: ${error.message}`;
            throw error;
        }
    }
}