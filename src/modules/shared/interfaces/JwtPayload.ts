/**
 * ★ Interfaz del payload del JWT
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
