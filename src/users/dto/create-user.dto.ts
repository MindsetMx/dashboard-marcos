// create-user.dto.ts
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsArray()
  @IsNotEmpty()
  acceso: string[];
}
