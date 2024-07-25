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
import { VnailModule } from './vnail/vnail.module';
import { MymboxModule } from './mymbox/mymbox.module';
import { ImpresionesModule } from './impresiones/impresiones.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    FrameitModule,
    AnalyticsModule,
    PaspartuframesModule,
    EnmarktModule,
    VnailModule,
    MymboxModule,
    ImpresionesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, AnalyticsController,],
  providers: [AppService, AnalyticsService],
})
export class AppModule {}
