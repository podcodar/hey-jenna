import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @MinLength(2)
  @MaxLength(40)
  name: string;
}

export class GetFilesQueryDTO {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsString()
  @IsNotEmpty()
  fileType: string;
}

export class UserIdDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  fileType: string;
}
