/**
 * Finds the `%TYPEDEF types.xml TypeName%` marker.
 */
export const typedefMdRe = /^ *%TYPEDEF (.+?)(?: (.+?))?%(-.+)?$/mg