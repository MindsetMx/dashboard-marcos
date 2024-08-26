import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ImpresionesService } from './impresiones.service';

@Controller('impresiones')
export class ImpresionesController {
  constructor(private readonly impresionesService: ImpresionesService) {}

//   @Get('orders')
//   async findAll(
//     @Query('size') size: number = 10,
//     @Query('page') page: number = 1,
//     @Query('dateStart') dateStart?: string,
//     @Query('dateEnd') dateEnd?: string,
//     @Query('search') search?: string,
//     @Query('orderBy') orderBy: 1 | -1 = 1,
//   ): Promise<any> {
//     return this.impresionesService.findAll({
//       size,
//       page,
//       dateStart,
//       dateEnd,
//       search,
//       orderBy,
//     });
//   }


@Get('users')
async findAllUsers(
  @Query('size') size: number = 10,
  @Query('page') page: number = 1,
  @Query('search') search?: string,
  @Query('orderBy') orderBy: 1 | -1 = 1,
): Promise<any> {
  return this.impresionesService.findAllUsers({
    size,
    page,
    search,
    orderBy,
  });
}



@Get('orders')
async findAll(
  @Query('size') size: number = 10,
  @Query('page') page: number = 1,
  @Query('dateStart') dateStart?: string,
  @Query('dateEnd') dateEnd?: string,
  @Query('search') search?: string,
  @Query('orderBy') orderBy: 1 | -1 = 1,
) {
  console.log('Request parameters:', { size, page, dateStart, dateEnd, search, orderBy });

  // Validar fechas
  if (dateStart && isNaN(Date.parse(dateStart))) {
    console.log(`Invalid dateStart value: '${dateStart}'`);
    throw new BadRequestException(`Invalid dateStart value: '${dateStart}'`);
  }
  if (dateEnd && isNaN(Date.parse(dateEnd))) {
    console.log(`Invalid dateEnd value: '${dateEnd}'`);
    throw new BadRequestException(`Invalid dateEnd value: '${dateEnd}'`);
  }

  return this.impresionesService.findAll({
    size,
    page,
    dateStart,
    dateEnd,
    search,
    orderBy,
  });
}

// @Get('orders')
// async findAll(
//   @Query('size') size: number = 10,
//   @Query('page') page: number = 1,
//   @Query('search') search?: string,
//   @Query('orderBy') orderBy: 1 | -1 = 1,
// ) {
//   console.log('Request parameters:', { size, page, search, orderBy });

//   return this.impresionesService.findAllWithoutDateFilters({
//     size,
//     page,
//     search,
//     orderBy,
//   });
// }


  
@Get('todas')
async todas() {
  return this.impresionesService.todas();
}

}
