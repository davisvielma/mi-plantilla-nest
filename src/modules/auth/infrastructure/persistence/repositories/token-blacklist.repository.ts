import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TokenBlacklistOrmEntity } from '../entities';
import { ITokenBlacklistRepository } from '../../../domain/repositories';

/**
 * ★ Implementación del Repositorio de Blacklist de Tokens
 *
 * Implementa ITokenBlacklistRepository usando TypeORM.
 */
@Injectable()
export class TokenBlacklistRepository implements ITokenBlacklistRepository {
  constructor(
    @InjectRepository(TokenBlacklistOrmEntity)
    private readonly blacklistRepository: Repository<TokenBlacklistOrmEntity>,
  ) {}

  async add(
    token: string,
    userId: string,
    type: 'access' | 'refresh',
    expiresAt: Date,
  ): Promise<void> {
    const entity = this.blacklistRepository.create({
      id: uuid(),
      token,
      userId,
      type,
      expiresAt,
    });

    await this.blacklistRepository.save(entity);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const count = await this.blacklistRepository.count({
      where: { token },
    });
    return count > 0;
  }

  async cleanExpired(): Promise<void> {
    await this.blacklistRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
