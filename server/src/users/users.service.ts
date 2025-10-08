import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async upsert(user: CreateUserDto): Promise<User> {
    return this.prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
}
