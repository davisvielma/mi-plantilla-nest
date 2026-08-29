import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@/modules/users/infrastructure/modules/users.module';
import { AuthController } from '../controllers/auth.controller';
import {
  LoginUseCase,
  RefreshTokenUseCase,
  RegisterUseCase,
  LogoutUseCase,
} from '../../application/use-cases';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { TOKEN_BLACKLIST_REPOSITORY } from '../../domain/repositories';
import { TokenBlacklistRepository } from '../persistence/repositories';
import { TokenBlacklistOrmEntity } from '../persistence/entities';
import type { StringValue } from 'ms';

/**
 * Módulo de Autenticación
 *
 * Configura la inyección de dependencias para el módulo de autenticación.
 * Incluye: strategies, use cases, y controllers.
 */
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([TokenBlacklistOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'jwt-secret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: TOKEN_BLACKLIST_REPOSITORY,
      useClass: TokenBlacklistRepository,
    },
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
