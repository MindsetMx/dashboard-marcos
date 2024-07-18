import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const cotizadorConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.COTIZADOR_DB_HOST,
  port: parseInt(process.env.COTIZADOR_DB_PORT, 10),
  username: process.env.COTIZADOR_DB_USERNAME,
  password: process.env.COTIZADOR_DB_PASSWORD,
  database: process.env.COTIZADOR_DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
};
