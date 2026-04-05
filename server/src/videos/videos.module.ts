import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { SystemService } from 'src/system.service';
import { AppLogger } from 'src/core/logging/app-logger.service';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [VideosService, SystemService, AppLogger],
})
export class VideosModule {}
