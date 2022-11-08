
/**
 * Set the first character to uppercase, and the rest to lowercase
 */
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}