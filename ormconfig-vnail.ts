import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const vnailConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.VNAIL_DB_HOST,
  port: parseInt(process.env.VNAIL_DB_PORT, 10),
  username: process.env.VNAIL_DB_USERNAME,
  password: process.env.VNAIL_DB_PASSWORD,
  database: process.env.VNAIL_DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  extra: {
    authPlugin: 'mysql_native_password',
  },
};
