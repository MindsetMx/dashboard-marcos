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

@Get('compras')
findAllCompras() {
  return this.paspartuframesService.findAllCompras();
}


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
    return this.paspartuframesService.findAll({
      size,
      page,
      dateStart,
      dateEnd,
      search,
      orderBy,
    });
  }

  @Get('product-categories')
  async getAllProductCategories(): Promise<any> {
    const categories = await this.paspartuframesService.getAllProductCategories();
    return {
      meta: {
        total: categories.length,
      },
      data: categories.map((category, index) => ({
        id: index + 1,
        attributes: {
          category,
        },
      })),
    };
  }

  @Get('top-molduras')
  async getTopMolduras(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('orderBy') orderBy: 1 | -1 = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ): Promise<any> {
    const molduraData = await this.paspartuframesService.getTopMolduras({
      page,
      size,
      orderBy,
      dateStart,
      dateEnd,
    });

    return {
      meta: {
        total: molduraData.length,
        page,
        size,
      },
      data: molduraData.map((item, index) => ({
        id: index + 1,
        attributes: {
          moldura: item.moldura,
          count: item.count,
        },
      })),
    };
  }

  @Get('sales-by-product-type')
  async getSalesByProductType(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('orderBy') orderBy: 1 | -1 = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ): Promise<any> {
    const salesData = await this.paspartuframesService.getSalesByProductType({
      page,
      size,
      orderBy,
      dateStart,
      dateEnd,
    });

    return {
      meta: {
        total: salesData.length,
        page,
        size,
      },
      data: salesData.map((item, index) => ({
        id: index + 1,
        attributes: {
          productType: item.productType,
          count: item.count,
        },
      })),
    };
  }

  @Get('check-dates')
  async checkDates(): Promise<any> {
    return this.paspartuframesService.checkDates();
  }
}
