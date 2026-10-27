export function validaString(cadena) {
    return typeof cadena === 'string' && cadena.trim().length > 0;
}