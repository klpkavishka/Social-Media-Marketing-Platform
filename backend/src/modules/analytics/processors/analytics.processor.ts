import { Processor, Process, OnQueueError, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Job } from 'bull';
import { AnalyticsAggregationService } from '../services/analytics-aggregation.service';
import type { AnalyticsJobData } from '../services/analytics-scheduler.service';
import { SocialAccount } from '../../social/entities/social-account.entity';

@Processor('analytics')
export class AnalyticsProcessor {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly aggregationService: AnalyticsAggregationService,
  ) {}

  /**
   * Process analytics aggregation job
   */
  @Process('aggregate-analytics')
  async handleAnalyticsAggregation(job: Job<AnalyticsJobData>) {
    this.logger.log(
      `Processing analytics aggregation job ${job.id} (${job.data.jobType})`,
    );

    const { jobType, accountId, platform, startDate, endDate } = job.data;

    try {
      await job.progress(10);

      let result;

      // Process based on job type
      if (accountId) {
        // Single account aggregation
        this.logger.log(`Aggregating analytics for account: ${accountId}`);
        const account = await this.getAccountById(accountId);
        result = await this.aggregationService.aggregateAccountAnalytics(
          account,
          new Date(startDate!),
          new Date(endDate!),
        );
        await job.progress(80);
      } else if (platform) {
        // Platform-specific aggregation
        this.logger.log(`Aggregating analytics for platform: ${platform}`);
        result = await this.aggregationService.aggregateByPlatform(
          platform,
          new Date(startDate!),
          new Date(endDate!),
        );
        await job.progress(80);
      } else {
        // All accounts aggregation
        this.logger.log('Aggregating analytics for all accounts');
        result = await this.aggregationService.aggregateAllAccounts(
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined,
        );
        await job.progress(80);
      }

      await job.progress(100);

      this.logger.log(
        `Successfully completed analytics aggregation job ${job.id}`,
      );

      return {
        jobId: job.id,
        jobType,
        success: true,
        result,
        completedAt: new Date(),
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to process analytics aggregation job ${job.id}: ${error.message}`,
        error.stack,
      );

      throw error; // Let Bull handle retry logic
    }
  }

  /**
   * Handle queue errors
   */
  @OnQueueError()
  onError(error: Error) {
    this.logger.error(`Queue error: ${error.message}`, error.stack);
  }

  /**
   * Handle failed jobs
   */
  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
      error.stack,
    );

    // You could implement additional error handling here:
    // - Send notifications
    // - Log to external monitoring service
    // - Store failure details in database
  }

  /**
   * Helper to get account by ID
   */
  private async getAccountById(accountId: string): Promise<SocialAccount> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error(`Social account not found: ${accountId}`);
    }

    return account;
  }
}
