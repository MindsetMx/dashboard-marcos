import { Controller, Get, Query } from '@nestjs/common';
import { EnmarktService } from './enmarkt.service';

@Controller('enmarkt')
export class EnmarktController {
  constructor(private readonly enmarktService: EnmarktService) {}


  @Get('orders')
  async findAll(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    return this.enmarktService.findAll({
      size,
      page,
      dateStart,
      dateEnd,
      search,
      orderBy,
    });
  }

  @Get('sales-by-product-type')
  async getSalesByProductType(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('orderBy') orderBy: 1 | -1 = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ): Promise<any> {
    const salesData = await this.enmarktService.getSalesByProductType({
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

  @Get('users')
  async findAllUsers(
    @Query('size') size: number = 10,
    @Query('page') page: number = 1,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: 1 | -1 = 1,
  ): Promise<any> {
    return this.enmarktService.findAllUsers({
      size,
      page,
      search,
      orderBy,
    });
  }
  

  @Get('top-molduras')
    async getTopMolduras(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('orderBy') orderBy: 1 | -1 = 1,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    ): Promise<any> {
    console.log('orderBy in controller:', orderBy);

    const molduraData = await this.enmarktService.getTopMolduras({
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



  @Get('analyze-categories')
  async analyzeProductCategories() {
    return this.enmarktService.analyzeProductCategories();
  }
}
