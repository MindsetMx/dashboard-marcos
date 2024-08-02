import { Controller, Get, Query } from '@nestjs/common';
import { MymboxService } from './mymbox.service';

@Controller('mymbox')
export class MymboxController {
  constructor(private readonly mymboxService: MymboxService) {}

  @Get('orders')
  async findAll(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    console.log('Parametros recibidos en el controlador:', { size, page, dateStart, dateEnd, search, orderBy });
    return this.mymboxService.findAllCompras({
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
    return this.mymboxService.findAllUsers({
      size,
      page,
      search,
      orderBy,
    });
  }
}
