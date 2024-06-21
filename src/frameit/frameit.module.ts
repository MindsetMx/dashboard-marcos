import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrameitService } from './frameit.service';
import { FrameitController } from './frameit.controller';
import { Compra } from './entities/compra.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Compra]),
  TypeOrmModule.forFeature([User]),],
  providers: [FrameitService],
  controllers: [FrameitController],
})
export class FrameitModule {}
