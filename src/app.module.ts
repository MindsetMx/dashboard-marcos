import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfigs } from 'ormconfig';
import { FrameitModule } from './frameit/frameit.module';

@Module({
  imports: databaseConfigs.map(config => TypeOrmModule.forRoot(config)),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
