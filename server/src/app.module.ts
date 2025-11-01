import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { PrismaService } from './prisma.service';
import { SystemService } from './system.service';

@Module({
  imports: [UsersModule, VideosModule],
  providers: [SystemService, PrismaService], // Do I need PrismaService here?
})
export class AppModule {}
