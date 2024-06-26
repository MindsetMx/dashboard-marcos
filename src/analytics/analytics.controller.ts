import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('web-visits')
  async getWebVisits(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getWebVisits(startDate, endDate);
  }

  @Get('visits')
  async getVisits(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('interval') interval: string,
  ): Promise<any> {
    return this.analyticsService.getVisits(startDate, endDate, interval);
  }

  @Get('geography')
  async getGeography(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getGeography(startDate, endDate);
  }

  @Get('pages')
  async getPages(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getPages(startDate, endDate);
  }

  @Get('conversions')
  async getConversions(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getConversions(startDate, endDate);
  }

  @Get('devices')
  async getDevices(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getDevices(startDate, endDate);
  }


  //REBOTE
  @Get('bounce-rate')
  async getBounceRate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getBounceRate(startDate, endDate);
  }


  //ORGANICO O DIRECTO

  @Get('organic-paid')
  async getOrganicDirect(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.analyticsService.getVisitsOrganicOrPaid(startDate, endDate);
  }

}
