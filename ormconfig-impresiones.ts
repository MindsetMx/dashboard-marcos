import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const impresionesConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.IMPRESIONES_DB_HOST,
  port: parseInt(process.env.IMPRESIONES_DB_PORT, 10),
  username: process.env.IMPRESIONES_DB_USERNAME,
  password: process.env.IMPRESIONES_DB_PASSWORD,
  database: process.env.IMPRESIONES_DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
};
