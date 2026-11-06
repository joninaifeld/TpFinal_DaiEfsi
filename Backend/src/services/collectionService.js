import config from '../config/dbconfig.js';
import pkg from 'pg';
import OpenLibraryService from './openLibraryService.js';

const { Client } = pkg;
const olService = new OpenLibraryService();

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

    getColeccionByIdAndUser = async (coleccionId, userId) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT id FROM colecciones WHERE id = $1 AND usuario_id = $2`;
            const result = await client.query(sql, [coleccionId, userId]);
            await client.end();
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            await client.end();
            throw new Error(`Error al verificar la colección: ${error.message}`);
        }
    }

    getOrCreateLibroLocal = async (client, olid) => {
        const findSql = `SELECT id FROM libros WHERE openlibrary_key = $1`;
        const findRes = await client.query(findSql, [olid]);

        if (findRes.rows.length > 0) {
            return findRes.rows[0].id;
        }

        const bookData = await olService.getBookAsync(olid);
        if (!bookData) {
            throw new Error("El libro no se encontró en Open Library");
        }

        const insertSql = `
            INSERT INTO libros (openlibrary_key, titulo, autor, cover_url, genero_principal)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const insertValues = [ bookData.openlibrary_key, bookData.titulo, bookData.autor || null, bookData.cover_url, bookData.generos?.[0] || null ];
        
        const insertRes = await client.query(insertSql, insertValues);
        return insertRes.rows[0].id;
    }

    addBookToColeccion = async (coleccionId, olid, userId) => {
        const coleccion = await this.getColeccionByIdAndUser(coleccionId, userId);
        if (!coleccion) {
            throw new Error("Colección no encontrada o no te pertenece");
        }

        const client = new Client(config);
        try {
            await client.connect();
            
            const libroId = await this.getOrCreateLibroLocal(client, olid);

            const sql = `
                INSERT INTO coleccion_libros (coleccion_id, libro_id, added_at)
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING coleccion_id, libro_id, added_at;
            `;
            
            const result = await client.query(sql, [coleccionId, libroId]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            await client.end();
            throw new Error(`Error al agregar el libro a la colección: ${error.message}`);
        }
    }

    isBookInColeccion = async (coleccionId, olid) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT cl.coleccion_id 
                FROM coleccion_libros cl
                JOIN libros l ON cl.libro_id = l.id
                WHERE cl.coleccion_id = $1 AND l.openlibrary_key = $2
            `;
            const result = await client.query(sql, [coleccionId, olid]);
            await client.end();
            return result.rows.length > 0;
        } catch (error) {
            await client.end();
            throw new Error(`Error al verificar el libro: ${error.message}`);
        }
    }

    removeBookFromColeccion = async (coleccionId, olid, userId) => {
        const coleccion = await this.getColeccionByIdAndUser(coleccionId, userId);
        if (!coleccion) {
            throw new Error("Colección no encontrada o no te pertenece");
        }

        const client = new Client(config);
        try {
            await client.connect();
            
            const sql = `
                DELETE FROM coleccion_libros cl
                USING libros l
                WHERE cl.libro_id = l.id
                  AND cl.coleccion_id = $1 
                  AND l.openlibrary_key = $2
                RETURNING cl.coleccion_id, cl.libro_id;
            `;
            
            const result = await client.query(sql, [coleccionId, olid]);
            await client.end();
            
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            await client.end();
            throw new Error(`Error al eliminar el libro de la colección: ${error.message}`);
        }
    }

    async updateColeccion(coleccionId, userId, nombre, descripcion) {
        const coleccion = await this.getColeccionByIdAndUser(coleccionId, userId);
        if (!coleccion) {
            throw new Error("Colección no encontrada o no te pertenece");
        }

        const client = new Client(config);
        try {
            await client.connect();
            
            const sql = `
                UPDATE colecciones 
                SET nombre = COALESCE($1, nombre), 
                    descripcion = COALESCE($2, descripcion)
                WHERE id = $3 AND usuario_id = $4
                RETURNING id, usuario_id, nombre, descripcion, created_at;
            `;
            
            const result = await client.query(sql, [nombre || null, descripcion !== undefined ? descripcion : null, coleccionId, userId]);
            await client.end();
            
            return result.rows[0];
        } catch (error) {
            await client.end();
            throw new Error(`Error al actualizar la colección: ${error.message}`);
        }
    }
}
