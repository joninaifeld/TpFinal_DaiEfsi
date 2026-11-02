export function validateString(cadena) {
    return typeof cadena === 'string' && cadena.trim().length > 0;
}