import config from '../config/dbconfig.js';
import pkg from 'pg';
import OpenLibraryService from './openLibraryService.js';
import ActivityService from '../services/activityService.js';

const { Client } = pkg;
const olService = new OpenLibraryService();
const activityService = new ActivityService();
export default class CollectionService {  
    getUserColecciones = async (userId) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT 
                    c.id, 
                    c.nombre, 
                    c.descripcion, 
                    c.created_at,
                    COUNT(cl.libro_id)::int AS cantidad_libros
                FROM colecciones c
                LEFT JOIN coleccion_libros cl ON c.id = cl.coleccion_id
                WHERE c.usuario_id = $1
                GROUP BY c.id
                ORDER BY c.created_at DESC;
            `;
            const result = await client.query(sql, [userId]);
            await client.end();
            return result.rows;
        } catch (error) {
            await client.end();
            throw new Error(`Error al obtener colecciones: ${error.message}`);
        }
    }

    getColeccionDetail = async (coleccionId, userId) => {
        const client = new Client(config);
        try {
            await client.connect();

            const colSql = `
                SELECT id, nombre, descripcion, created_at
                FROM colecciones
                WHERE id = $1 AND usuario_id = $2;
            `;
            const colRes = await client.query(colSql, [coleccionId, userId]);
            if (colRes.rows.length === 0) {
                await client.end();
                return null;
            }

            const librosSql = `
                SELECT 
                    l.id,
                    l.openlibrary_key,
                    l.titulo,
                    l.autor,
                    l.cover_url,
                    l.genero_principal,
                    cl.added_at,
                    el.estado,
                    COALESCE(el.es_favorito, false) AS es_favorito
                FROM coleccion_libros cl
                JOIN libros l ON cl.libro_id = l.id
                LEFT JOIN estado_lectura el ON el.libro_id = l.id AND el.usuario_id = $2
                WHERE cl.coleccion_id = $1
                ORDER BY cl.added_at DESC;
            `;
            const librosRes = await client.query(librosSql, [coleccionId, userId]);
            await client.end();

            return {
                ...colRes.rows[0],
                libros: librosRes.rows
            };
        } catch (error) {
            await client.end();
            throw new Error(`Error al obtener detalle de la colección: ${error.message}`);
        }
    }
    
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

            const nuevaCol = result.rows[0];
            await activityService.logActivity(
                userId,
                'coleccion',
                `Creó la colección "${nuevaCol.nombre}"`,
                { coleccionId: nuevaCol.id },
                client
            );

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

            const infoRes = await client.query(
                `SELECT l.titulo, c.nombre FROM libros l, colecciones c WHERE l.id = $1 AND c.id = $2`,
                [libroId, coleccionId]
            );
            const { titulo, nombre } = infoRes.rows[0] || { titulo: olid, nombre: 'la colección' };

            await activityService.logActivity(
                userId,
                'coleccion',
                `Agregó "${titulo}" a la colección "${nombre}"`,
                { libroId, coleccionId },
                client
            );

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

            const { libro_id } = result.rows[0];
            await activityService.logActivity(
                userId,
                'coleccion',
                `Quitó un libro de una colección`,
                { libroId: libro_id, coleccionId },
                client
            );

            await client.end();
            
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            await client.end();
            throw new Error(`Error al eliminar el libro de la colección: ${error.message}`);
        }
    }

    updateColeccion = async (coleccionId, userId, nombre, descripcion) => {
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

    deleteColeccion = async (coleccionId, userId) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                DELETE FROM colecciones
                WHERE id = $1 AND usuario_id = $2
                RETURNING id, nombre;
            `;
            const result = await client.query(sql, [coleccionId, userId]);

            if (result.rows.length > 0) {
                await activityService.logActivity(
                    userId,
                    'coleccion',
                    `Eliminó la colección "${result.rows[0].nombre}"`,
                    {},
                    client
                );
            }

            await client.end();
            return result.rows[0] || null;
        } catch (error) {
            await client.end();
            throw new Error(`Error al eliminar la colección: ${error.message}`);
        }
    }
}
