/**
 * Constantes para los roles del sistema
 *
 * Centraliza los nombres de los roles para evitar typos
 */
export const ROLES = {
  ADMIN: 'admin',
  SUPER_USER: 'super-user',
  USER: 'user',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
