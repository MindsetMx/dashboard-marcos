// users.service.ts
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { nombre, correo, password, tipo, acceso } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const userObject = {
        nombre,
        correo,
        password: hashedPassword,
        tipo,
        acceso,
      };

      const createdUser = new this.userModel(userObject);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.correo) {
        throw new ConflictException('El correo ya está registrado.');
      } else {
        throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }

  async findByEmail(correo: string): Promise<User | null> {
    return this.userModel.findOne({ correo }).exec();
  }

  async validateUser(correo: string, pass: string): Promise<any> {
    console.log(correo, pass);
    const user = await this.userModel.findOne({ correo }).exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  
}
