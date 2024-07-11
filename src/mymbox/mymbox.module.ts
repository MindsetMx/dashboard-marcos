import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MymboxService } from './mymbox.service';
import { MymboxController } from './mymbox.controller';
import { Compra } from './entities/compra.entity';
import { Usuario } from './entities/usuarios.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra], 'mymboxConnection'),
    TypeOrmModule.forFeature([Usuario], 'mymboxConnection'),
  ],
  providers: [MymboxService],
  controllers: [MymboxController],
})
export class MymboxModule {}
