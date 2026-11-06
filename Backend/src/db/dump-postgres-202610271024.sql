--
-- PostgreSQL database dump (Actualizado)
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


SET default_tablespace = '';

SET default_table_access_method = heap;


--
-- Name: estado_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_lectura (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    libro_id integer NOT NULL,
    estado character varying(30), -- Permite NULL para marcar favoritos sin estado
    es_favorito boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT estado_lectura_estado_check CHECK (((estado)::text = ANY ((ARRAY['Quiero leer'::character varying, 'Leyendo'::character varying, 'Leído'::character varying, 'Abandonado'::character varying])::text[])))
);


ALTER TABLE public.estado_lectura OWNER TO postgres;

--
-- Name: estado_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_lectura_id_seq OWNER TO postgres;

ALTER SEQUENCE public.estado_lectura_id_seq OWNED BY public.estado_lectura.id;


--
-- Name: coleccion_libros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleccion_libros (
    coleccion_id integer NOT NULL,
    libro_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.coleccion_libros OWNER TO postgres;

--
-- Name: colecciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colecciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.colecciones OWNER TO postgres;

--
-- Name: colecciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colecciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colecciones_id_seq OWNER TO postgres;

ALTER SEQUENCE public.colecciones_id_seq OWNED BY public.colecciones.id;


--
-- Name: libros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.libros (
    id integer NOT NULL,
    openlibrary_key character varying(100) NOT NULL,
    titulo character varying(255) NOT NULL,
    autor character varying(255),
    cover_url text,
    genero_principal character varying(100)
);


ALTER TABLE public.libros OWNER TO postgres;

--
-- Name: libros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.libros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.libros_id_seq OWNER TO postgres;

ALTER SEQUENCE public.libros_id_seq OWNED BY public.libros.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    avatar_url text,
    bio text,
    reading_goal_annual integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_reading_goal_annual_check CHECK ((reading_goal_annual >= 0))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: valoraciones_resenas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valoraciones_resenas (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    libro_id integer NOT NULL,
    puntuacion integer NOT NULL,
    resena_texto text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valoraciones_resenas_puntuacion_check CHECK (((puntuacion >= 1) AND (puntuacion <= 5)))
);


ALTER TABLE public.valoraciones_resenas OWNER TO postgres;

--
-- Name: valoraciones_resenas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.valoraciones_resenas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.valoraciones_resenas_id_seq OWNER TO postgres;

ALTER SEQUENCE public.valoraciones_resenas_id_seq OWNED BY public.valoraciones_resenas.id;


--
-- Defaults
--

ALTER TABLE ONLY public.actividades ALTER COLUMN id SET DEFAULT nextval('public.actividades_id_seq'::regclass);
ALTER TABLE ONLY public.estado_lectura ALTER COLUMN id SET DEFAULT nextval('public.estado_lectura_id_seq'::regclass);
ALTER TABLE ONLY public.colecciones ALTER COLUMN id SET DEFAULT nextval('public.colecciones_id_seq'::regclass);
ALTER TABLE ONLY public.libros ALTER COLUMN id SET DEFAULT nextval('public.libros_id_seq'::regclass);
ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
ALTER TABLE ONLY public.valoraciones_resenas ALTER COLUMN id SET DEFAULT nextval('public.valoraciones_resenas_id_seq'::regclass);


--
-- Sequences Setting
--

SELECT pg_catalog.setval('public.estado_lectura_id_seq', 1, true);
SELECT pg_catalog.setval('public.colecciones_id_seq', 1, true);
SELECT pg_catalog.setval('public.libros_id_seq', 1, true);
SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);
SELECT pg_catalog.setval('public.valoraciones_resenas_id_seq', 1, true);


--
-- Constraints & Indexes
--

ALTER TABLE ONLY public.estado_lectura
    ADD CONSTRAINT estado_lectura_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.coleccion_libros
    ADD CONSTRAINT coleccion_libros_pkey PRIMARY KEY (coleccion_id, libro_id);

ALTER TABLE ONLY public.colecciones
    ADD CONSTRAINT colecciones_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_openlibrary_key_key UNIQUE (openlibrary_key);

ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.estado_lectura
    ADD CONSTRAINT uq_usuario_libro UNIQUE (usuario_id, libro_id);

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT uq_usuario_libro_resena UNIQUE (usuario_id, libro_id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT valoraciones_resenas_pkey PRIMARY KEY (id);

-- Restricciones únicas y de nombres para colecciones
ALTER TABLE ONLY public.colecciones
    ADD CONSTRAINT uq_usuario_nombre_coleccion UNIQUE (usuario_id, nombre);

CREATE INDEX idx_libros_openlibrary_key ON public.libros USING btree (openlibrary_key);

CREATE INDEX idx_colecciones_usuario ON public.colecciones USING btree (usuario_id);


--
-- Foreign Keys
--

ALTER TABLE ONLY public.estado_lectura
    ADD CONSTRAINT estado_lectura_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.estado_lectura
    ADD CONSTRAINT estado_lectura_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.coleccion_libros
    ADD CONSTRAINT coleccion_libros_coleccion_id_fkey FOREIGN KEY (coleccion_id) REFERENCES public.colecciones(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.coleccion_libros
    ADD CONSTRAINT coleccion_libros_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.colecciones
    ADD CONSTRAINT colecciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT valoraciones_resenas_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT valoraciones_resenas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;