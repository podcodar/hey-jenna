import { Injectable } from '@nestjs/common';
import { SystemService } from 'src/system.service';

@Injectable()
export class VideosService {
  constructor(private readonly systemService: SystemService) {}

  async getFolderContents() {
    return this.systemService.getFolderContents();
  }
}
