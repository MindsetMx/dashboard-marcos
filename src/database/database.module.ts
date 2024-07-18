import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { frameitConfig } from 'ormconfig';
import { paspartuframesConfig } from 'ormconfig-paspartuframes';
import { enmarktConfig } from 'ormconfig-enmarkt';
import { vnailConfig } from 'ormconfig-vnail';
import { DatabaseController } from './database.controller';
import { mymboxConfig } from 'ormconfig-mymbox';
import { impresionesConfig } from 'ormconfig-impresiones';
import { cotizadorConfig } from 'ormconfig-cotizador';

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
    TypeOrmModule.forRoot({
      ...vnailConfig,
      name: 'vnailConnection',
    }),
    TypeOrmModule.forRoot({
      ...mymboxConfig,
      name: 'mymboxConnection',
    }),
    TypeOrmModule.forRoot({
      ...impresionesConfig,
      name: 'impresionesConnection',
    }),
    // TypeOrmModule.forRoot({
    //   ...cotizadorConfig,
    //   name: 'cotizadorConnection',
    // }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}
