-- ==========================================
-- SEED DE DEMOSTRACIÓN: MY COLLECTION (LIBROS)
-- ==========================================

-- 1. Usuario demo (ajustá password_hash si necesitás loguearte con contraseña real)
INSERT INTO public.usuarios (id, username, email, password_hash, avatar_url, bio, reading_goal_annual)
VALUES (
    1,
    'lector_demo',
    'demo@mycollection.local',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=lector_demo',
    'Lectura constante de ciencia ficción, ensayo y narrativa contemporánea.',
    20
)
ON CONFLICT (id) DO NOTHING;

-- 2. 10 libros con openlibrary_key, título, autor, portada y género
INSERT INTO public.libros (id, openlibrary_key, titulo, autor, cover_url, genero_principal)
VALUES
    (1, '/works/OL45883W', 'Cien años de soledad', 'Gabriel García Márquez', 'https://covers.openlibrary.org/b/id/8231990-L.jpg', 'Realismo mágico'),
    (2, '/works/OL82563W', '1984', 'George Orwell', 'https://covers.openlibrary.org/b/id/7222246-L.jpg', 'Ciencia ficción'),
    (3, '/works/OL66554W', 'El nombre del viento', 'Patrick Rothfuss', 'https://covers.openlibrary.org/b/id/8275645-L.jpg', 'Fantasía'),
    (4, '/works/OL15626669W', 'Hábitos atómicos', 'James Clear', 'https://covers.openlibrary.org/b/id/8739161-L.jpg', 'Desarrollo personal'),
    (5, '/works/OL27258W', 'Fahrenheit 451', 'Ray Bradbury', 'https://covers.openlibrary.org/b/id/8268452-L.jpg', 'Ciencia ficción'),
    (6, '/works/OL14866048W', 'Sapiens: De animales a dioses', 'Yuval Noah Harari', 'https://covers.openlibrary.org/b/id/8231856-L.jpg', 'Historia'),
    (7, '/works/OL26320W', 'El hobbit', 'J.R.R. Tolkien', 'https://covers.openlibrary.org/b/id/6979861-L.jpg', 'Fantasía'),
    (8, '/works/OL468431W', 'Dune', 'Frank Herbert', 'https://covers.openlibrary.org/b/id/8101356-L.jpg', 'Ciencia ficción'),
    (9, '/works/OL1168083W', 'Orgullo y prejuicio', 'Jane Austen', 'https://covers.openlibrary.org/b/id/8235657-L.jpg', 'Clásicos'),
    (10, '/works/OL17365009W', 'El código limpio', 'Robert C. Martin', 'https://covers.openlibrary.org/b/id/8406786-L.jpg', 'Tecnología')
ON CONFLICT (id) DO NOTHING;

-- 3. Biblioteca / Estado de lectura (10 libros, 3 estados, 5 favoritos)
INSERT INTO public.estado_lectura (usuario_id, libro_id, estado, es_favorito)
VALUES
    (1, 1, 'Leído', true),
    (1, 2, 'Leído', true),
    (1, 3, 'Leído', true),
    (1, 4, 'Leído', true),
    (1, 5, 'Leído', false),
    (1, 6, 'Leído', false),
    (1, 7, 'Leyendo', true),
    (1, 8, 'Leyendo', false),
    (1, 9, 'Quiero leer', false),
    (1, 10, 'Quiero leer', false)
ON CONFLICT DO NOTHING;

-- 4. Puntuaciones y reseñas (5 puntuaciones, 3 reseñas con texto)
INSERT INTO public.valoraciones_resenas (usuario_id, libro_id, puntuacion, resena_texto)
VALUES
    (1, 1, 5, 'Una obra maestra absoluta; cada relectura descubre detalles nuevos.'),
    (1, 2, 5, 'Vigencia inquietante y una construcción de mundo inolvidable.'),
    (1, 3, 4, 'Muy atrapante desde el primer capítulo, con un ritmo excelente.'),
    (1, 4, 4, NULL),
    (1, 5, 5, NULL)
ON CONFLICT DO NOTHING;

-- 5. 3 Colecciones
INSERT INTO public.colecciones (id, usuario_id, nombre, descripcion)
VALUES
    (1, 1, 'Imprescindibles del año', 'Libros que marcaron el año y recomiendo leer completos.'),
    (2, 1, 'Universos de ficción', 'Ciencia ficción y fantasía para desconectar y viajar.'),
    (3, 1, 'Pendientes para el finde', 'Lecturas cortas o técnicas para avanzar de a poco.')
ON CONFLICT (id) DO NOTHING;

-- 6. Libros dentro de las colecciones
INSERT INTO public.coleccion_libros (coleccion_id, libro_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 4),
    (2, 3),
    (2, 5),
    (2, 7),
    (2, 8),
    (3, 9),
    (3, 10)
ON CONFLICT DO NOTHING;

-- 7. Actividad reciente
INSERT INTO public.actividades (usuario_id, tipo_accion, descripcion, libro_id, coleccion_id)
VALUES
    (1, 'ESTADO', 'Marcó "Cien años de soledad" como Leído', 1, NULL),
    (1, 'FAVORITO', 'Agregó "1984" a favoritos', 2, NULL),
    (1, 'RESENA', 'Publicó una reseña en "Cien años de soledad"', 1, NULL),
    (1, 'ESTADO', 'Comenzó a leer "El hobbit"', 7, NULL),
    (1, 'COLECCION', 'Creó la colección "Imprescindibles del año"', NULL, 1)
ON CONFLICT DO NOTHING;

-- 8. Sincronizar secuencias de IDs para evitar choques al insertar desde la app
SELECT setval(pg_get_serial_sequence('public.usuarios', 'id'), COALESCE((SELECT MAX(id) FROM public.usuarios), 1), true);
SELECT setval(pg_get_serial_sequence('public.libros', 'id'), COALESCE((SELECT MAX(id) FROM public.libros), 1), true);
SELECT setval(pg_get_serial_sequence('public.estado_lectura', 'id'), COALESCE((SELECT MAX(id) FROM public.estado_lectura), 1), true);
SELECT setval(pg_get_serial_sequence('public.valoraciones_resenas', 'id'), COALESCE((SELECT MAX(id) FROM public.valoraciones_resenas), 1), true);
SELECT setval(pg_get_serial_sequence('public.colecciones', 'id'), COALESCE((SELECT MAX(id) FROM public.colecciones), 1), true);
SELECT setval(pg_get_serial_sequence('public.actividades', 'id'), COALESCE((SELECT MAX(id) FROM public.actividades), 1), true);