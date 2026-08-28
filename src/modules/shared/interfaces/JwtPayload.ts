/**
 * Interfaz del payload del JWT
 */
export interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  role: { id: string; name: string };
}
