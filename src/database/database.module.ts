import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoClient } from 'mongodb';
import { ConfigType } from '@nestjs/config';
import config from '../config';
import { frameitConfig } from 'ormconfig';
import { paspartuframesConfig } from 'ormconfig-paspartuframes';
import { enmarktConfig } from 'ormconfig-enmarkt';
import { vnailConfig } from 'ormconfig-vnail';
import { mymboxConfig } from 'ormconfig-mymbox';
import { impresionesConfig } from 'ormconfig-impresiones';
import { cotizadorConfig } from 'ormconfig-cotizador';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, port, dbName } = configService.mongo;
        return {
          uri: `${connection}://${user}:${password}@${host}:${port}/?authSource=admin`,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [config.KEY],
    }),
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
    // TypeOrmModule.forRoot({
    //   ...impresionesConfig,
    //   name: 'impresionesConnection',
    // }),
    // TypeOrmModule.forRoot({
    //   ...cotizadorConfig,
    //   name: 'cotizadorConnection',
    // }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? 'PROD1212121SA' : '12345634',
    },
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, port, dbName } = configService.mongo;
        const uri = `${connection}://${user}:${password}@${host}:${port}/?authSource=admin&readPreference=primary`;
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db(dbName);
        return database;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'MONGO', MongooseModule],
})
export class DatabaseModule {}
