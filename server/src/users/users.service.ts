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
    const users = await this.prisma.user.findMany();
    this.logger.log(`Users fetched successfully. Total users:${users.length}`);
    return users;
  }
  async upsert(user: CreateUserDto): Promise<User> {
    this.logger.log(`Upserting user with email ${user.email}`);
    try {
      const result = await this.prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      });
      this.logger.log(`User upserted successfully with email ${user.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to upsert user with email ${user.email}`);
      throw error;
    }
  }
}
