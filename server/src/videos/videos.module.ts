import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { SystemService } from 'src/system.service';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [VideosService, SystemService],
})
export class VideosModule {}
