/**
 * Puerto: Repositorio de Blacklist de Tokens
 *
 * Define las operaciones que debe implementar la infraestructura.
 */
export interface ITokenBlacklistRepository {
  /**
   * Guarda un token en la blacklist
   */
  add(
    token: string,
    userId: string,
    type: 'access' | 'refresh',
    expiresAt: Date,
  ): Promise<void>;

  /**
   * Verifica si un token está en la blacklist
   */
  isBlacklisted(token: string): Promise<boolean>;

  /**
   * Elimina tokens expirados de la blacklist
   */
  cleanExpired(): Promise<void>;
}

export const TOKEN_BLACKLIST_REPOSITORY = Symbol('TOKEN_BLACKLIST_REPOSITORY');
