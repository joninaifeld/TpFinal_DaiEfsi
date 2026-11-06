import config from '../config/dbconfig.js';
import pkg from 'pg';
import OpenLibraryService from './openLibraryService.js';

const { Client } = pkg;
const olService = new OpenLibraryService();

export default class BookService {
    
    async getOrCreateLibroLocal(client, olid) {
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
        const insertValues = [bookData.openlibrary_key, bookData.titulo, bookData.autor || null, bookData.cover_url, bookData.generos?.[0] || null];
        
        const insertRes = await client.query(insertSql, insertValues);
        return insertRes.rows[0].id;
    }

    async upsertEstado(userId, olid, nuevoEstado) {
        const client = new Client(config);
        try {
            await client.connect();
            
            const libroId = await this.getOrCreateLibroLocal(client, olid);

            const sql = `
                INSERT INTO estado_lectura (usuario_id, libro_id, estado, updated_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                ON CONFLICT (usuario_id, libro_id)
                DO UPDATE SET 
                    estado = EXCLUDED.estado,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id, usuario_id, libro_id, estado, es_favorito, updated_at;
            `;
            
            const result = await client.query(sql, [userId, libroId, nuevoEstado]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            await client.end();
            throw new Error(`Error al actualizar estado de lectura: ${error.message}`);
        }
    }

    async upsertFavorito(userId, olid, esFavorito) {
        const client = new Client(config);
        try {
            await client.connect();
            
            const libroId = await this.getOrCreateLibroLocal(client, olid);

            const sql = `
                INSERT INTO estado_lectura (usuario_id, libro_id, es_favorito, updated_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                ON CONFLICT (usuario_id, libro_id)
                DO UPDATE SET 
                    es_favorito = EXCLUDED.es_favorito,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id, usuario_id, libro_id, estado, es_favorito, updated_at;
            `;
            
            const result = await client.query(sql, [userId, libroId, esFavorito]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            await client.end();
            throw new Error(`Error al actualizar favorito: ${error.message}`);
        }
    }
}