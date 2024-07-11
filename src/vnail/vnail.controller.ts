import { Controller, Get, Query } from '@nestjs/common';
import { VnailService } from './vnail.service';
import { Compra } from './entities/compra.entity';
import { Usuario } from './entities/usuario.entity';

@Controller('vnail')
export class VnailController {
  constructor(private readonly vnailService: VnailService) {}


  @Get('orders')
  async findAll(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    console.log('Request parameters:', { size, page, dateStart, dateEnd, search, orderBy });
    return this.vnailService.findAll({
      size,
      page,
      dateStart,
      dateEnd,
      search,
      orderBy,
    });
  }


  @Get('users')
async findAllUsers(
  @Query('size') size: number = 10,
  @Query('page') page: number = 1,
  @Query('search') search?: string,
  @Query('orderBy') orderBy: 1 | -1 = 1,
): Promise<any> {
  return this.vnailService.findAllUsers({
    size,
    page,
    search,
    orderBy,
  });
}

}
