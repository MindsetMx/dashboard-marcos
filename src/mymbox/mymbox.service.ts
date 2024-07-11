import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { Usuario } from './entities/usuarios.entity';

@Injectable()
export class MymboxService {
  constructor(
    @InjectRepository(Compra, 'mymboxConnection')
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(Usuario, 'mymboxConnection')
    private readonly userRepository: Repository<Usuario>,
  ) {}



  async findAllCompras(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
    // Calcular el monto total de todas las ventas en el rango de fechas sin limitar por paginación
    const totalAmountQuery = this.compraRepository.createQueryBuilder('compra')
      .select('SUM(JSON_EXTRACT(compra.informacion_envio, "$.total"))', 'total');
  
    if (dateStart) {
      totalAmountQuery.andWhere('compra.created_at >= :dateStart', { dateStart });
    }
  
    if (dateEnd) {
      totalAmountQuery.andWhere('compra.created_at <= :dateEnd', { dateEnd });
    }
  
    const totalAmountResult = await totalAmountQuery.getRawOne();
    const totalAmount = totalAmountResult.total || 0;
  
    const query = this.compraRepository.createQueryBuilder('compra')
      .select([
        'compra.id',
        'compra.user_id',
        'compra.email',
        'compra.productos',
        'compra.informacion_envio',
        'compra.status_pago',
        'compra.created_at',
        'compra.updated_at'
      ]);
  
    console.log('Parametros:', params);
  
    if (dateStart) {
      query.andWhere('compra.created_at >= :dateStart', { dateStart });
    }
  
    if (dateEnd) {
      query.andWhere('compra.created_at <= :dateEnd', { dateEnd });
    }
  
    if (search) {
      query.andWhere('compra.email LIKE :search', { search: `%${search}%` });
    }
  
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('compra.created_at', orderDirection);
    }
  
    query.skip((page - 1) * size).take(size);
  
    console.log('SQL generado:', query.getSql());
  
    const [result, total] = await query.getManyAndCount();
  
    console.log('Resultados de la consulta:', result);
  
    return {
      meta: {
        total,
        page,
        size,
        totalAmount, // Agregar el monto total de las ventas al metadato
      },
      data: result.map(compra => {
        let productos = '';
        try {
          const parsedProductos = JSON.parse(compra.productos);
          if (Array.isArray(parsedProductos)) {
            productos = parsedProductos.map((p: any) => p.producto.categoria || 'sin categoria').join(', ');
          } else if (typeof parsedProductos === 'object') {
            productos = Object.values(parsedProductos).map((p: any) => p.producto.categoria || 'sin categoria').join(', ');
          }
        } catch (error) {
          console.error('Error parsing productos:', error);
        }
  
        let cliente = '';
        let total = 0;
        let status = '';
        try {
          const parsedInformacionEnvio = JSON.parse(compra.informacion_envio);
          cliente = parsedInformacionEnvio.destinatario || '';
          total = parsedInformacionEnvio.total || 0;
          status = parsedInformacionEnvio.estatus || '';
        } catch (error) {
          console.error('Error parsing informacion_envio:', error);
        }
  
        console.log('Compra procesada:', {
          id: compra.id,
          cliente,
          productos,
          total,
          fecha: compra.created_at,
          status,
        });
  
        return {
          id: compra.id,
          attributes: {
            numero_pedido: compra.id,
            cliente,
            correo: compra.email,
            productos,
            total,
            fecha: compra.created_at,
            status,
          },
        };
      }),
    };
  }
  
  
  
  
  
  
  
  
  
  

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
}
