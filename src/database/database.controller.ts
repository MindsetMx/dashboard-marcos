import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('frameit')
  async getFrameitData() {
    return this.databaseService.getFrameitData();
  }

  @Get('paspartuframes')
  async getPaspartuframesData() {
    return this.databaseService.getPaspartuframesData();
  }

  @Get('enmarkt')
  async getEnmarktData() {
    return this.databaseService.getEnmarktData();
  }
}
