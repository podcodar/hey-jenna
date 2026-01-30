import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './users.dto';
import { AppLogger } from 'src/core/logging/app-logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async get(): Promise<User[]> {
    this.logger.customLog('Listing users', {
      feature: 'users',
      action: 'list',
    });

    const users = await this.prisma.user.findMany();

    this.logger.customLog('Users listed', {
      count: users.length,
    });
    return users;
  }

  async upsert(user: CreateUserDto): Promise<User> {
    this.logger.customLog('Upserting user', {
      feature: 'users',
      action: 'upsert',
      email: user.email,
    });

    try {
      const saved = await this.prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      });
      this.logger.customLog('User upserted', {
        id: saved.id,
        email: saved.email,
      });
      return saved;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.customLog('Upsert failed', {
        email: user.email,
        error: message,
      });
    }
  }
}
