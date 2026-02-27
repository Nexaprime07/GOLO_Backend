import { forwardRef, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { AdsModule } from '../ads/ads.module'; // Import AdsModule

@Module({
  imports: [forwardRef(() => AdsModule)], // Add this to resolve AdsService dependency
  providers: [KafkaService],
  controllers: [KafkaController],
  exports: [KafkaService],
})
export class KafkaModule {}