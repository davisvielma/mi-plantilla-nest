/**
 * Constantes para mensajes de error y respuesta
 *
 * Centraliza todos los mensajes para facilitar cambios y mantener consistencia
 */
export const MESSAGES = {
  // Errores comunes
  INTERNAL_ERROR: 'Error interno del servidor',
  NOT_FOUND: 'Recurso no encontrado',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',

  // Usuarios
  USER_CREATED: 'Usuario creado exitosamente',
  USER_UPDATED: 'Usuario actualizado exitosamente',
  USER_DELETED: 'Usuario eliminado exitosamente',
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_ALREADY_EXISTS: 'El email ya está registrado',

  // Autenticación
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  TOKEN_EXPIRED: 'El token ha expirado',
  TOKEN_INVALID: 'Token inválido',
  REFRESH_TOKEN_SUCCESS: 'Token refrescado exitosamente',

  // Roles
  ROLE_NOT_FOUND: 'Rol no encontrado',
  INVALID_ROLE: 'Rol inválido',

  // Validaciones
  INVALID_EMAIL: 'El formato del email es inválido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
  NAME_TOO_SHORT: 'El nombre debe tener al menos 3 caracteres',
  FIELD_REQUIRED: 'El campo es requerido',
} as const;

export type MessageKey = keyof typeof MESSAGES;
