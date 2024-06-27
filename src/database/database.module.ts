import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { frameitConfig } from 'ormconfig';
import { paspartuframesConfig } from 'ormconfig-paspartuframes';
import { enmarktConfig } from 'ormconfig-enmarkt';
import { DatabaseController } from './database.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(frameitConfig),
    TypeOrmModule.forRoot({
      ...paspartuframesConfig,
      name: 'paspartuframesConnection',
    }),
    TypeOrmModule.forRoot({
      ...enmarktConfig,
      name: 'enmarktConnection',
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}
