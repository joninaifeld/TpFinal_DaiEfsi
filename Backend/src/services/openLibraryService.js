const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org/b/id";

const headers = { "User-Agent": "TpFinalDaiEfsi (santinicohong@gmail.com)" };

const coverUrl = (coverId, size = "M") =>
  coverId ? `${COVERS_URL}/${coverId}-${size}.jpg` : null;

export default class OpenLibraryService {
  searchBooksAsync = async (q, page = 1, limit = 10) => {
    const url = new URL(`${BASE_URL}/search.json`);
    url.searchParams.set("q", q);
    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);
    url.searchParams.set("fields", "key,title,author_name,cover_i,first_publish_year,subject");

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Open Library respondió ${res.status}`);

    const data = await res.json();
    return {
      total: data.numFound,
      resultados: data.docs.map((d) => ({
        openlibrary_key: d.key.replace("/works/", ""),
        titulo: d.title,
        autor: d.author_name?.[0] ?? null,
        cover_url: coverUrl(d.cover_i),
        anio: d.first_publish_year ?? null,
        genero_principal: d.subject?.[0] ?? null,
      })),
    };
  };

  getBookAsync = async (olid) => {
    const res = await fetch(`${BASE_URL}/works/${olid}.json`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Open Library respondió ${res.status}`);

    const d = await res.json();
    return {
      openlibrary_key: olid,
      titulo: d.title,
      descripcion: typeof d.description === "string" ? d.description : d.description?.value ?? null,
      generos: d.subjects?.slice(0, 5) ?? [],
      cover_url: coverUrl(d.covers?.[0], "L"),
    };
  };
}