import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaspartuframesService } from './paspartuframes.service';
import { PaspartuframesController } from './paspartuframes.controller';
import { User } from './entities/user.entity';
import { Compra } from './entities/compra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Compra], 'paspartuframesConnection'), // Nombre de la conexión adicional
  ],
  providers: [PaspartuframesService],
  controllers: [PaspartuframesController],
})
export class PaspartuframesModule {}
