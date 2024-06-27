import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { PaspartuframesService } from './paspartuframes.service';
import { User } from './entities/user.entity';
import { Compra } from './entities/compra.entity';

@Controller('paspartuframes')
export class PaspartuframesController {
  constructor(private readonly paspartuframesService: PaspartuframesService) {}

  @Get('users')
  async findAllUsers(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    return this.paspartuframesService.findAllUsers({
      size,
      page,
      search,
      orderBy,
    });
  }

  @Get('users/:id')
  findOneUser(@Param('id') id: number) {
    return this.paspartuframesService.findOneUser(id);
  }

  @Post('users')
  createUser(@Body() user: User) {
    return this.paspartuframesService.createUser(user);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    return this.paspartuframesService.updateUser(id, user);
  }

  @Delete('users/:id')
  removeUser(@Param('id') id: number) {
    return this.paspartuframesService.removeUser(id);
  }

  // Rutas y métodos de controlador para compras
  @Get('orders')
  findAllCompras() {
    return this.paspartuframesService.findAllCompras();
  }

  @Get('compras/:id')
  findOneCompra(@Param('id') id: number) {
    return this.paspartuframesService.findOneCompra(id);
  }

  @Post('compras')
  createCompra(@Body() compra: Compra) {
    return this.paspartuframesService.createCompra(compra);
  }

  @Put('compras/:id')
  updateCompra(@Param('id') id: number, @Body() compra: Compra) {
    return this.paspartuframesService.updateCompra(id, compra);
  }

  @Delete('compras/:id')
  removeCompra(@Param('id') id: number) {
    return this.paspartuframesService.removeCompra(id);
  }
}
