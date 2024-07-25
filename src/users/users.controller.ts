// users.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.usersService.create(createUserDto);

      // Generar token JWT
      const token = await this.authService.generateToken(user);

      // Construir la respuesta en formato JSON API
      return {
        data: {
          type: 'users',
          id: user._id.toString(),
          attributes: {
            nombre: user.nombre,
            correo: user.correo,
            tipo: user.tipo,
            acceso: user.acceso,
          },
        },
        meta: {
          message: 'Usuario registrado con éxito',
          token: token,
        },
      };
    } catch (error) {
      // Manejar errores
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const { correo, password } = loginUserDto;

    console.log(correo, password);

    if (!correo || !password) {
      throw new BadRequestException('Es necesario proporcionar un correo y contraseña para iniciar sesión.');
    }

    const user = await this.usersService.validateUser(correo, password);
    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const token = await this.authService.generateToken(user);
    const { password: userPassword, ...userAttributes } = user.toObject ? user.toObject() : user;

    return {
      data: {
        type: 'users',
        id: user._id.toString(),
        attributes: userAttributes,
      },
      meta: {
        token: token,
      },
    };
  }
}
