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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Cargar variables de entorno
    DatabaseModule,
    FrameitModule,
    AnalyticsModule,
    PaspartuframesModule,
    EnmarktModule,
    VnailModule,
    MymboxModule,
    ImpresionesModule,
  ],
  controllers: [AppController, AnalyticsController,],
  providers: [AppService, AnalyticsService],
})
export class AppModule {}
