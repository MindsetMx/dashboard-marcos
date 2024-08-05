import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { Usuario } from './entities/usuario.entity';


const categoriasMap = {
  1: 'Grapas de ensamble',
  2: 'Puntas de enmarcado',
  3: 'Maquinas de corte y ensamble',
  4: 'Pistolas de enmarcado',
  5: 'Cortadoras de marialuisa',
  6: 'Insumos para marcos'
};


@Injectable()
export class VnailService {
  constructor(
    @InjectRepository(Compra, 'vnailConnection')
    private compraRepository: Repository<Compra>,
    @InjectRepository(Usuario, 'vnailConnection')
    private userRepository: Repository<Usuario>,

  ) {}


  // async findAll(params: {
  //   size: number;
  //   page: number;
  //   dateStart?: string;
  //   dateEnd?: string;
  //   search?: string;
  //   orderBy?: 1 | -1;
  // }): Promise<any> {
  //   const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
  //   const totalAmountQuery = this.compraRepository.createQueryBuilder('compra')
  //     .select('SUM(compra.total)', 'total');
  
  //   if (dateStart) {
  //     totalAmountQuery.andWhere('compra.created_at >= :dateStart', { dateStart });
  //   }
  
  //   if (dateEnd) {
  //     totalAmountQuery.andWhere('compra.created_at <= :dateEnd', { dateEnd });
  //   }
  
  //   const totalAmountResult = await totalAmountQuery.getRawOne();
  //   const totalAmount = totalAmountResult.total || 0;
  
  //   const query = this.compraRepository.createQueryBuilder('compra');
  
  //   if (dateStart) {
  //     query.andWhere('compra.created_at >= :dateStart', { dateStart });
  //   }
  
  //   if (dateEnd) {
  //     query.andWhere('compra.created_at <= :dateEnd', { dateEnd });
  //   }
  
  //   if (search) {
  //     query.andWhere('compra.user_id = :search OR compra.email LIKE :search', { search: `%${search}%` });
  //   }
  
  //   if (orderBy) {
  //     const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
  //     query.orderBy('compra.created_at', orderDirection);
  //   }
  
  //   query.skip((page - 1) * size).take(size);
  
  //   const [result, total] = await query.getManyAndCount();
  
  //   // Obtener los correos electrónicos basados en los user_ids
  //   const userIds = result.map(compra => compra.user_id);
  //   const users = await this.userRepository.findByIds(userIds);
  //   const userMap = new Map(users.map(user => [user.id, user.email]));
  
  //   console.log('Resultados obtenidos:', result);
  
  //   return {
  //     meta: {
  //       total,
  //       page,
  //       size,
  //       totalAmount,
  //     },
  //     data: result.map((compra: any) => {
  //       let productos = '';
  //       let cliente = '';
  //       const correo = userMap.get(compra.user_id) || compra.email || '';
  
  //       console.log('Procesando compra:', compra);
  
  //       if (compra.resumen) {
  //         try {
  //           const parsedResumen = typeof compra.resumen === 'string' ? JSON.parse(compra.resumen) : compra.resumen;
  //           productos = Object.values(parsedResumen).map((p: any) => categoriasMap[p.options.categoria_id] || p.name).join(', ');
  //           console.log('Productos parseados:', parsedResumen);
  //         } catch (error) {
  //           console.error('Error parsing resumen:', error);
  //         }
  //       }
  
  //       if (compra.direccion) {
  //         try {
  //           const parsedDireccion = typeof compra.direccion === 'string' ? JSON.parse(compra.direccion) : compra.direccion;
  //           cliente = parsedDireccion.nombre || '';
  //           console.log('Dirección parseada:', parsedDireccion);
  //         } catch (error) {
  //           console.error('Error parsing direccion:', error);
  //         }
  //       }
  
  //       return {
  //         id: compra.id,
  //         attributes: {
  //           numero_pedido: compra.id,
  //           cliente,
  //           productos,
  //           total: compra.total,
  //           correo,
  //           fecha: compra.created_at,
  //           status: compra.estatus_id,
  //         },
  //       };
  //     }),
  //   };
  // }



  async findAll(params: {
    size: number;
    page: number;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
    orderBy?: 1 | -1;
  }): Promise<any> {
    const { size, page, dateStart, dateEnd, search, orderBy } = params;
  
    // Consulta para calcular el monto total solo de los estados permitidos
    const totalAmountQuery = this.compraRepository.createQueryBuilder('compra')
      .select('SUM(compra.total)', 'total')
      .where('compra.estatus_id IN (:...statusIds)', { statusIds: [2, 3, 4] }); // estados de pagos completados
  
    if (dateStart) {
      totalAmountQuery.andWhere('compra.created_at >= :dateStart', { dateStart });
    }
  
    if (dateEnd) {
      totalAmountQuery.andWhere('compra.created_at <= :dateEnd', { dateEnd });
    }
  
    const totalAmountResult = await totalAmountQuery.getRawOne();
    const totalAmount = totalAmountResult.total || 0;
  
    // Consulta para obtener las compras
    const query = this.compraRepository.createQueryBuilder('compra')
      .where('compra.estatus_id IN (:...statusIds)', { statusIds: [2, 3, 4] }); // estados de pagos completados
  
    if (dateStart) {
      query.andWhere('compra.created_at >= :dateStart', { dateStart });
    }
  
    if (dateEnd) {
      query.andWhere('compra.created_at <= :dateEnd', { dateEnd });
    }
  
    if (search) {
      query.andWhere('compra.user_id = :search OR compra.email LIKE :search', { search: `%${search}%` });
    }
  
    if (orderBy) {
      const orderDirection = orderBy === 1 ? 'ASC' : 'DESC';
      query.orderBy('compra.created_at', orderDirection);
    }
  
    query.skip((page - 1) * size).take(size);
  
    const [result, total] = await query.getManyAndCount();
  
    // Obtener los correos electrónicos basados en los user_ids
    const userIds = result.map(compra => compra.user_id);
    const users = await this.userRepository.findByIds(userIds);
    const userMap = new Map(users.map(user => [user.id, user.email]));
  
    console.log('Resultados obtenidos:', result);
  
    return {
      meta: {
        total,
        page,
        size,
        totalAmount,
      },
      data: result.map((compra: any) => {
        let productos = '';
        let cliente = '';
        const correo = userMap.get(compra.user_id) || compra.email || '';
  
        console.log('Procesando compra:', compra);
  
        if (compra.resumen) {
          try {
            const parsedResumen = typeof compra.resumen === 'string' ? JSON.parse(compra.resumen) : compra.resumen;
            productos = Object.values(parsedResumen).map((p: any) => categoriasMap[p.options.categoria_id] || p.name).join(', ');
            console.log('Productos parseados:', parsedResumen);
          } catch (error) {
            console.error('Error parsing resumen:', error);
          }
        }
  
        if (compra.direccion) {
          try {
            const parsedDireccion = typeof compra.direccion === 'string' ? JSON.parse(compra.direccion) : compra.direccion;
            cliente = parsedDireccion.nombre || '';
            console.log('Dirección parseada:', parsedDireccion);
          } catch (error) {
            console.error('Error parsing direccion:', error);
          }
        }
  
        return {
          id: compra.id,
          attributes: {
            numero_pedido: compra.id,
            cliente,
            productos,
            total: compra.total,
            correo,
            fecha: compra.created_at,
            status: compra.estatus_id,
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
