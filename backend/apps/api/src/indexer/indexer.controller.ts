import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES, IndexerJobData } from '@app/queue';

/**
 * Indexer Webhook Controller
 * Receives events from Envio HyperIndex and enqueues them for processing
 */
@Controller('indexer')
export class IndexerController {
  private readonly logger = new Logger(IndexerController.name);
  private readonly webhookSecret = process.env.WEBHOOK_SECRET || 'delegator-ai-secret-change-in-production';

  constructor(
    @InjectQueue(QUEUE_NAMES.INDEXER) private readonly indexerQueue: Queue,
  ) {}

  /**
   * Webhook endpoint for Envio events
   * POST /indexer/webhook
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleEnvioWebhook(
    @Headers('x-envio-secret') secret: string,
    @Body() payload: {
      chainId: number;
      eventName: string;
      blockNumber: string | number;
      transactionHash: string;
      logIndex: number;
      data: any;
    },
  ) {
    // Validate webhook secret
    if (secret !== this.webhookSecret) {
      this.logger.warn(`Invalid webhook secret from ${payload.transactionHash}`);
      throw new UnauthorizedException('Invalid webhook secret');
    }

    try {
      // Transform Envio payload to IndexerJobData
      const jobData: IndexerJobData = {
        chainId: payload.chainId,
        eventName: payload.eventName,
        blockNumber: BigInt(payload.blockNumber),
        transactionHash: payload.transactionHash,
        logIndex: payload.logIndex,
        data: payload.data,
      };

      // Enqueue for processing
      await this.indexerQueue.add('process-event', jobData, {
        priority: this.getEventPriority(payload.eventName),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      this.logger.log(
        `✅ Enqueued ${payload.eventName} from chain ${payload.chainId} (block ${payload.blockNumber})`,
      );

      return {
        success: true,
        message: 'Event queued for processing',
      };
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get priority for different event types
   * Higher priority = processed first
   */
  private getEventPriority(eventName: string): number {
    const priorities: Record<string, number> = {
      // High priority - triggers immediate action
      RebalanceExecuted: 1,
      RebalanceFailed: 1,
      PriceFeedUpdated: 2,
      
      // Medium priority - important state changes
      DelegationCreated: 3,
      DelegationRevoked: 3,
      StrategyCreated: 3,
      
      // Lower priority - informational
      StrategyUpdated: 5,
      StrategyDeactivated: 5,
      SwapExecuted: 5,
    };

    return priorities[eventName] || 10;
  }

  /**
   * Health check endpoint
   * GET /indexer/health
   */
  @Post('health')
  async health() {
    const queueHealth = await this.indexerQueue.getJobCounts();
    
    return {
      status: 'ok',
      queue: {
        waiting: queueHealth.waiting,
        active: queueHealth.active,
        completed: queueHealth.completed,
        failed: queueHealth.failed,
      },
    };
  }
}
