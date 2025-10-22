import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { IndexerController } from './indexer.controller';
import { QUEUE_NAMES } from '@app/queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.INDEXER,
    }),
  ],
  controllers: [IndexerController],
})
export class IndexerModule {}
