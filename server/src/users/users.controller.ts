import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'generated/prisma';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get(): Promise<User[]> {
    return this.usersService.get();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  upsert(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.upsert(user);
  }
}
