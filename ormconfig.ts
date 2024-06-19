import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const frameitConfig: TypeOrmModuleOptions = {
  type: process.env.DB_CONNECTION as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};


// const paspartuframesConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'paspartuframes_user',
//   password: 'paspartuframes_password',
//   database: 'paspartuframes',
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: true,
// };

// Define configurations for other databases similarly...

export const databaseConfigs = [
  frameitConfig,
//   paspartuframesConfig,
  // Add other configurations here...
];
