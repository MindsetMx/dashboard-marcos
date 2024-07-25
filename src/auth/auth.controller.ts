import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }


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
}
