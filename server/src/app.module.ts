import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { PrismaService } from './prisma.service';
import { SystemService } from './system.service';
import { LoggerModule } from './core/logging/logger.module';

@Module({
  imports: [UsersModule, VideosModule, LoggerModule],
  providers: [SystemService, PrismaService], // Do I need PrismaService here?
})
export class AppModule {}
