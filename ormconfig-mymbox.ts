import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const mymboxConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYMBOX_DB_HOST,
  port: parseInt(process.env.MYMBOX_DB_PORT, 10),
  username: process.env.MYMBOX_DB_USERNAME,
  password: process.env.MYMBOX_DB_PASSWORD,
  database: process.env.MYMBOX_DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  extra: {
    authPlugin: 'mysql_native_password',
  },
};
