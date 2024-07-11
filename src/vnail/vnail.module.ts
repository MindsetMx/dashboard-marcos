import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { Usuario } from './entities/usuario.entity';
import { VnailService } from './vnail.service';
import { VnailController } from './vnail.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, Usuario], 'vnailConnection'),
  ],
  providers: [VnailService],
  controllers: [VnailController],
})
export class VnailModule {}
