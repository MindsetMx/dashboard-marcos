import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { FrameitService } from './frameit.service';
import { Compra } from './entities/compra.entity';
import { User } from './entities/user.entity';

@Controller('frameit')
export class FrameitController {
  constructor(private readonly frameitService: FrameitService) {}

  @Get('orders')
  async findAll(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    return this.frameitService.findAll({
      size,
      page,
      dateStart,
      dateEnd,
      search,
      orderBy,
    });
  }
  
  @Get('orders/:id')
  findOne(@Param('id') id: number): Promise<Compra> {
    return this.frameitService.findOne(id);
  }

  @Delete('orders/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.frameitService.remove(id);
  }

  // Rutas para "User"
  @Get('users')
  async findAllUsers(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    return this.frameitService.findAllUsers({
      size,
      page,
      search,
      orderBy,
    });
  }
  

  @Get('users/:id')
  findOneUser(@Param('id') id: number): Promise<User> {
    return this.frameitService.findOneUser(id);
  }

  @Delete('users/:id')
  removeUser(@Param('id') id: number): Promise<void> {
    return this.frameitService.removeUser(id);
  }
}
