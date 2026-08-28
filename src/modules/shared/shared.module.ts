import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './exceptions/filters/http-exception.filter';

/**
 * Módulo Compartido (Shared)
 *
 * Registra todos los componentes transversales como providers globales:
 * - Guards de autenticación y autorización
 * - Interceptors para respuestas uniformes
 * - Filters para manejo de errores
 *
 * Este módulo se importa una vez en AppModule y está disponible en toda la aplicación.
 */
@Global()
@Module({
  providers: [
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class SharedModule {}
