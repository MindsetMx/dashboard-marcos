// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUserAndGenerateToken(loginUserDto: LoginUserDto): Promise<string> {
    const { correo, password } = loginUserDto;
    const user = await this.usersService.findByEmail(correo);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.correo, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async generateToken(user: any): Promise<string> {
    const payload = { email: user.correo, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { correo, password } = loginUserDto;
    const user = await this.usersService.validateUser(correo, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);
    const userObj = user.toObject ? user.toObject() : user;
    const { password: userPassword, ...userAttributes } = userObj;

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
