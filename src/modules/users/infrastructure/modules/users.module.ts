import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity, RoleOrmEntity } from './../persistence/entities';
import { UserRepository } from './../persistence/repositories';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UsersController } from './../controllers';
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
  UpdateUserRoleUseCase,
  SoftDeleteUserUseCase,
} from '../../application/use-cases';

/**
 * ★ Módulo de Usuarios
 *
 * Configura la inyección de dependencias para el módulo de usuarios.
 * Incluye: repositories, use cases, y controllers.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity])],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    FindUserByIdUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    UpdateUserRoleUseCase,
    SoftDeleteUserUseCase,
  ],
  exports: [
    USER_REPOSITORY,
    CreateUserUseCase,
    FindUserByIdUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    UpdateUserRoleUseCase,
    SoftDeleteUserUseCase,
  ],
})
export class UsersModule {}
