--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2026-10-27 10:24:10

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
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16504)
-- Name: actividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actividades (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    tipo_actividad character varying(50) NOT NULL,
    descripcion text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.actividades OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16503)
-- Name: actividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.actividades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actividades_id_seq OWNER TO postgres;

--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 227
-- Name: actividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.actividades_id_seq OWNED BY public.actividades.id;


--
-- TOC entry 221 (class 1259 OID 16428)
-- Name: biblioteca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biblioteca (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    libro_id integer NOT NULL,
    estado character varying(30) NOT NULL,
    es_favorito boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT biblioteca_estado_check CHECK (((estado)::text = ANY ((ARRAY['Quiero leer'::character varying, 'Leyendo'::character varying, 'Leído'::character varying, 'Abandonado'::character varying])::text[])))
);


ALTER TABLE public.biblioteca OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16427)
-- Name: biblioteca_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.biblioteca_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.biblioteca_id_seq OWNER TO postgres;

--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 220
-- Name: biblioteca_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.biblioteca_id_seq OWNED BY public.biblioteca.id;


--
-- TOC entry 226 (class 1259 OID 16487)
-- Name: coleccion_libros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coleccion_libros (
    coleccion_id integer NOT NULL,
    libro_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.coleccion_libros OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16473)
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
-- TOC entry 224 (class 1259 OID 16472)
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

--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 224
-- Name: colecciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colecciones_id_seq OWNED BY public.colecciones.id;


--
-- TOC entry 219 (class 1259 OID 16416)
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
-- TOC entry 218 (class 1259 OID 16415)
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

--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 218
-- Name: libros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.libros_id_seq OWNED BY public.libros.id;


--
-- TOC entry 217 (class 1259 OID 16400)
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
-- TOC entry 216 (class 1259 OID 16399)
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

--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 216
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 223 (class 1259 OID 16450)
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
-- TOC entry 222 (class 1259 OID 16449)
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

--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 222
-- Name: valoraciones_resenas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.valoraciones_resenas_id_seq OWNED BY public.valoraciones_resenas.id;


--
-- TOC entry 4676 (class 2604 OID 16507)
-- Name: actividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades ALTER COLUMN id SET DEFAULT nextval('public.actividades_id_seq'::regclass);


--
-- TOC entry 4668 (class 2604 OID 16431)
-- Name: biblioteca id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biblioteca ALTER COLUMN id SET DEFAULT nextval('public.biblioteca_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 16476)
-- Name: colecciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colecciones ALTER COLUMN id SET DEFAULT nextval('public.colecciones_id_seq'::regclass);


--
-- TOC entry 4667 (class 2604 OID 16419)
-- Name: libros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libros ALTER COLUMN id SET DEFAULT nextval('public.libros_id_seq'::regclass);


--
-- TOC entry 4664 (class 2604 OID 16403)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 16453)
-- Name: valoraciones_resenas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_resenas ALTER COLUMN id SET DEFAULT nextval('public.valoraciones_resenas_id_seq'::regclass);


--
-- TOC entry 4869 (class 0 OID 16504)
-- Dependencies: 228
-- Data for Name: actividades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actividades (id, usuario_id, tipo_actividad, descripcion, created_at) FROM stdin;
1	1	CAMBIO_ESTADO	Marcó "Dune" como Leído	2026-10-27 10:21:18.666201
\.


--
-- TOC entry 4862 (class 0 OID 16428)
-- Dependencies: 221
-- Data for Name: biblioteca; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.biblioteca (id, usuario_id, libro_id, estado, es_favorito, updated_at) FROM stdin;
1	1	1	Leído	t	2026-10-27 10:21:18.666201
\.


--
-- TOC entry 4867 (class 0 OID 16487)
-- Dependencies: 226
-- Data for Name: coleccion_libros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coleccion_libros (coleccion_id, libro_id, added_at) FROM stdin;
1	1	2026-10-27 10:21:18.666201
\.


--
-- TOC entry 4866 (class 0 OID 16473)
-- Dependencies: 225
-- Data for Name: colecciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colecciones (id, usuario_id, nombre, descripcion, created_at) FROM stdin;
1	1	Favoritos Sci-Fi	Mi lista personal de imperdibles del espacio.	2026-10-27 10:21:18.666201
\.


--
-- TOC entry 4860 (class 0 OID 16416)
-- Dependencies: 219
-- Data for Name: libros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.libros (id, openlibrary_key, titulo, autor, cover_url, genero_principal) FROM stdin;
1	/works/OL27448W	Dune	Frank Herbert	https://covers.openlibrary.org/b/id/12818862-L.jpg	Science Fiction
\.


--
-- TOC entry 4858 (class 0 OID 16400)
-- Dependencies: 217
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, username, email, password_hash, avatar_url, bio, reading_goal_annual, created_at) FROM stdin;
1	demo_user	demo@bookly.com	$2b$10$wT3I4uX3q4z5v6w7x8y9uO0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o	\N	Lector apasionado de ciencia ficción y fantasía.	12	2026-10-27 10:21:18.666201
\.


--
-- TOC entry 4864 (class 0 OID 16450)
-- Dependencies: 223
-- Data for Name: valoraciones_resenas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valoraciones_resenas (id, usuario_id, libro_id, puntuacion, resena_texto, created_at) FROM stdin;
1	1	1	5	Una obra maestra de la ciencia ficción.	2026-10-27 10:21:18.666201
\.


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 227
-- Name: actividades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.actividades_id_seq', 1, true);


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 220
-- Name: biblioteca_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.biblioteca_id_seq', 1, true);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 224
-- Name: colecciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colecciones_id_seq', 1, true);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 218
-- Name: libros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.libros_id_seq', 1, true);


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 216
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 222
-- Name: valoraciones_resenas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.valoraciones_resenas_id_seq', 1, true);


--
-- TOC entry 4705 (class 2606 OID 16512)
-- Name: actividades actividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades
    ADD CONSTRAINT actividades_pkey PRIMARY KEY (id);


--
-- TOC entry 4693 (class 2606 OID 16436)
-- Name: biblioteca biblioteca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biblioteca
    ADD CONSTRAINT biblioteca_pkey PRIMARY KEY (id);


--
-- TOC entry 4703 (class 2606 OID 16492)
-- Name: coleccion_libros coleccion_libros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion_libros
    ADD CONSTRAINT coleccion_libros_pkey PRIMARY KEY (coleccion_id, libro_id);


--
-- TOC entry 4701 (class 2606 OID 16481)
-- Name: colecciones colecciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colecciones
    ADD CONSTRAINT colecciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 16425)
-- Name: libros libros_openlibrary_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_openlibrary_key_key UNIQUE (openlibrary_key);


--
-- TOC entry 4691 (class 2606 OID 16423)
-- Name: libros libros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 16438)
-- Name: biblioteca uq_usuario_libro; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biblioteca
    ADD CONSTRAINT uq_usuario_libro UNIQUE (usuario_id, libro_id);


--
-- TOC entry 4697 (class 2606 OID 16461)
-- Name: valoraciones_resenas uq_usuario_libro_resena; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT uq_usuario_libro_resena UNIQUE (usuario_id, libro_id);


--
-- TOC entry 4682 (class 2606 OID 16414)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4684 (class 2606 OID 16410)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16412)
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- TOC entry 4699 (class 2606 OID 16459)
-- Name: valoraciones_resenas valoraciones_resenas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT valoraciones_resenas_pkey PRIMARY KEY (id);


--
-- TOC entry 4687 (class 1259 OID 16426)
-- Name: idx_libros_openlibrary_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_libros_openlibrary_key ON public.libros USING btree (openlibrary_key);


--
-- TOC entry 4713 (class 2606 OID 16513)
-- Name: actividades actividades_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades
    ADD CONSTRAINT actividades_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4706 (class 2606 OID 16444)
-- Name: biblioteca biblioteca_libro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biblioteca
    ADD CONSTRAINT biblioteca_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id) ON DELETE CASCADE;


--
-- TOC entry 4707 (class 2606 OID 16439)
-- Name: biblioteca biblioteca_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biblioteca
    ADD CONSTRAINT biblioteca_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4711 (class 2606 OID 16493)
-- Name: coleccion_libros coleccion_libros_coleccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion_libros
    ADD CONSTRAINT coleccion_libros_coleccion_id_fkey FOREIGN KEY (coleccion_id) REFERENCES public.colecciones(id) ON DELETE CASCADE;


--
-- TOC entry 4712 (class 2606 OID 16498)
-- Name: coleccion_libros coleccion_libros_libro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coleccion_libros
    ADD CONSTRAINT coleccion_libros_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id) ON DELETE CASCADE;


--
-- TOC entry 4710 (class 2606 OID 16482)
-- Name: colecciones colecciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colecciones
    ADD CONSTRAINT colecciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4708 (class 2606 OID 16467)
-- Name: valoraciones_resenas valoraciones_resenas_libro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT valoraciones_resenas_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id) ON DELETE CASCADE;


--
-- TOC entry 4709 (class 2606 OID 16462)
-- Name: valoraciones_resenas valoraciones_resenas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_resenas
    ADD CONSTRAINT valoraciones_resenas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-10-27 10:24:10

--
-- PostgreSQL database dump complete
--

