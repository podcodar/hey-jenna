import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'generated/prisma';
import { CreateUserDto, GetFilesQueryDTO, UserIdDTO } from './users.dto';
@UsePipes(new ValidationPipe())
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  get(): Promise<User[]> {
    return this.usersService.get();
  }

  // Example on how to extract url params and query params
  @Get('/:id/files/:fileType')
  getFiles(
    @Param() urlParams: UserIdDTO,
    @Query() query: GetFilesQueryDTO,
  ): Promise<User[]> {
    this.logger.debug(
      `Query: ${JSON.stringify(query)}, Params: ${JSON.stringify(urlParams)}`,
    );

    return this.usersService.get();
  }

  @Post()
  upsert(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.upsert(user);
  }
}
