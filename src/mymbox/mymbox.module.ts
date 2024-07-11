import { Module } from '@nestjs/common';
import { MymboxService } from './mymbox.service';

@Module({
  providers: [MymboxService]
})
export class MymboxModule {}
