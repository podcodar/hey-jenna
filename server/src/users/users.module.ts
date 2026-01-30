import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { LoggerModule } from 'src/core/logging/logger.module';

@Module({
  controllers: [UsersController],
  imports: [LoggerModule],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
