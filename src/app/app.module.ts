import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { SharedModule } from '@/modules/shared/shared.module';
import { UsersModule } from '@/modules/users/infrastructure/modules/users.module';
import { AuthModule } from '@/modules/auth/infrastructure/modules/auth.module';

/**
 * Módulo Principal de la Aplicación
 *
 * Configura todos los módulos globales y conecta la aplicación.
 */
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Base de datos
    DatabaseModule,

    // Módulo compartido (guards, interceptors, filters)
    SharedModule,

    // Módulos de funcionalidad
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
