// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { frameitConfig } from 'ormconfig';
// import { FrameitModule } from './frameit/frameit.module';
// import { AnalyticsService } from './analytics/analytics.service';
// import { AnalyticsController } from './analytics/analytics.controller';
// import { AnalyticsModule } from './analytics/analytics.module';
// import { paspartuframesConfig } from 'ormconfig-paspartuframes';
// // import { AuthModule } from './auth/auth.module';
// // import { UsersModule } from './users/users.module';
// import { PaspartuframesModule } from './paspartuframes/paspartuframes.module';
// import { enmarktConfig } from 'ormconfig-enmarkt';
// import { DatabaseModule } from './database/database.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }), // Cargar variables de entorno
//     // TypeOrmModule.forRoot(frameitConfig),
//     // TypeOrmModule.forRoot({
//     //   ...paspartuframesConfig,
//     //   name: 'paspartuframesConnection',
//     // }),
//     // TypeOrmModule.forRoot({
//     //   ...enmarktConfig,
//     //   name: 'enmarktConnection',
//     // }),
//     // MongooseModule.forRoot(
//     //   `${process.env.MONGO_CONNECTION}://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
//     // ),
//     FrameitModule,
//     AnalyticsModule,
//     PaspartuframesModule,
//     // DatabaseModule,
//     // AuthModule,
//     // UsersModule,
//   ],
//   controllers: [AppController, AnalyticsController],
//   providers: [AppService, AnalyticsService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FrameitModule } from './frameit/frameit.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PaspartuframesModule } from './paspartuframes/paspartuframes.module';
import { DatabaseModule } from './database/database.module';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { EnmarktModule } from './enmarkt/enmarkt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Cargar variables de entorno
    DatabaseModule,
    FrameitModule,
    AnalyticsModule,
    PaspartuframesModule,
    EnmarktModule,
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, AnalyticsService],
})
export class AppModule {}
