import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Compra } from './entities/compra.entity';

@Injectable()
export class PaspartuframesService {
  constructor(
    @InjectRepository(User, 'paspartuframesConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Compra, 'paspartuframesConnection')
    private readonly compraRepository: Repository<Compra>,
  ) {}

  // Métodos de servicio para manejar usuarios
  async findAllUsers(params: {
    size: number;
    page: number;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, search, orderBy } = params;

    const query = this.userRepository.createQueryBuilder('user');

    if (search) {
      query.andWhere('user.name LIKE :search OR user.email LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('user.created_at', orderDirection);
    }

    query.skip((page - 1) * size).take(size);

    const [result, total] = await query.getManyAndCount();

    return {
      meta: {
        total,
        page,
        size,
      },
      data: result.map(user => ({
        id: user.id,
        attributes: {
          correo: user.email,
          nombre: user.name,
          fechaRegistro: user.created_at,
        },
      })),
    };
  }

  async findOneUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }

  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Métodos de servicio para manejar compras
  async findAllCompras(): Promise<Compra[]> {
    return this.compraRepository.find();
  }

  async findOneCompra(id: number): Promise<Compra> {
    return this.compraRepository.findOne({ where: { id } });
  }

  async createCompra(compra: Compra): Promise<Compra> {
    return this.compraRepository.save(compra);
  }

  async updateCompra(id: number, compra: Compra): Promise<void> {
    await this.compraRepository.update(id, compra);
  }

  async removeCompra(id: number): Promise<void> {
    await this.compraRepository.delete(id);
  }
}
