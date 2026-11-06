import config from '../config/dbconfig.js';
import pkg from 'pg';

const { Client } = pkg;

export default class CollectionService {  
    getColeccionByName = async (userId, nombre) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT id FROM colecciones WHERE usuario_id = $1 AND nombre = $2`;
            const result = await client.query(sql, [userId, nombre]);
            await client.end();
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            await client.end();
            throw new Error(`Error al verificar la colección: ${error.message}`);
        }
    }

    createColeccion = async (userId, nombre, descripcion) => {
        const client = new Client(config);
        try {
            await client.connect();
            
            const sql = `
                INSERT INTO colecciones (usuario_id, nombre, descripcion, created_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING id, usuario_id, nombre, descripcion, created_at;
            `;
            
            const result = await client.query(sql, [userId, nombre, descripcion || null]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            await client.end();
            throw new Error(`Error al crear la colección: ${error.message}`);
        }
    }
}