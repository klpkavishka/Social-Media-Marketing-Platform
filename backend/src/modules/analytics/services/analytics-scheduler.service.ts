import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsAggregationService } from './analytics-aggregation.service';

export interface AnalyticsJobData {
  jobType: 'hourly' | 'daily' | 'weekly' | 'manual';
  accountId?: string;
  platform?: string;
  startDate?: Date;
  endDate?: Date;
  triggeredBy?: string;
}

@Injectable()
export class AnalyticsSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsSchedulerService.name);
  private isEnabled = true;

  constructor(
    @InjectQueue('analytics') private readonly analyticsQueue: Queue,
    private readonly aggregationService: AnalyticsAggregationService,
  ) {}

  onModuleInit() {
    this.logger.log('Analytics Scheduler Service initialized');
  }

  /**
   * Schedule hourly analytics collection
   * Runs every hour at minute 0
   */
  @Cron(CronExpression.EVERY_HOUR)
  async scheduleHourlyCollection() {
    if (!this.isEnabled) {
      this.logger.debug('Scheduler is disabled, skipping hourly collection');
      return;
    }

    this.logger.log('Scheduling hourly analytics collection');

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // Last hour

    const jobData: AnalyticsJobData = {
      jobType: 'hourly',
      startDate,
      endDate,
      triggeredBy: 'cron',
    };

    await this.addAggregationJob(jobData);
  }

  /**
   * Schedule daily analytics collection
   * Runs every day at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleDailyCollection() {
    if (!this.isEnabled) {
      this.logger.debug('Scheduler is disabled, skipping daily collection');
      return;
    }

    this.logger.log('Scheduling daily analytics collection');

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

    const jobData: AnalyticsJobData = {
      jobType: 'daily',
      startDate,
      endDate,
      triggeredBy: 'cron',
    };

    await this.addAggregationJob(jobData);
  }

  /**
   * Schedule weekly analytics collection
   * Runs every Sunday at midnight
   */
  @Cron(CronExpression.EVERY_WEEK)
  async scheduleWeeklyCollection() {
    if (!this.isEnabled) {
      this.logger.debug('Scheduler is disabled, skipping weekly collection');
      return;
    }

    this.logger.log('Scheduling weekly analytics collection');

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

    const jobData: AnalyticsJobData = {
      jobType: 'weekly',
      startDate,
      endDate,
      triggeredBy: 'cron',
    };

    await this.addAggregationJob(jobData);
  }

  /**
   * Manually trigger analytics collection for all accounts
   */
  async triggerManualCollection(
    startDate?: Date,
    endDate?: Date,
    triggeredBy = 'manual',
  ): Promise<string> {
    this.logger.log('Manually triggering analytics collection');

    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const jobData: AnalyticsJobData = {
      jobType: 'manual',
      startDate: start,
      endDate: end,
      triggeredBy,
    };

    const job = await this.addAggregationJob(jobData);
    return job.id.toString();
  }

  /**
   * Trigger collection for a specific account
   */
  async triggerAccountCollection(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<string> {
    this.logger.log(`Triggering analytics collection for account: ${accountId}`);

    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const jobData: AnalyticsJobData = {
      jobType: 'manual',
      accountId,
      startDate: start,
      endDate: end,
      triggeredBy: 'manual',
    };

    const job = await this.addAggregationJob(jobData);
    return job.id.toString();
  }

  /**
   * Trigger collection for a specific platform
   */
  async triggerPlatformCollection(
    platform: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<string> {
    this.logger.log(`Triggering analytics collection for platform: ${platform}`);

    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const jobData: AnalyticsJobData = {
      jobType: 'manual',
      platform,
      startDate: start,
      endDate: end,
      triggeredBy: 'manual',
    };

    const job = await this.addAggregationJob(jobData);
    return job.id.toString();
  }

  /**
   * Add aggregation job to queue
   */
  private async addAggregationJob(data: AnalyticsJobData) {
    const job = await this.analyticsQueue.add('aggregate-analytics', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000, // Start with 5 seconds
      },
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 500, // Keep last 500 failed jobs
    });

    this.logger.log(
      `Added analytics aggregation job to queue: ${job.id} (${data.jobType})`,
    );

    return job;
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string) {
    const job = await this.analyticsQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    return {
      id: job.id,
      data: job.data,
      progress: await job.progress(),
      state: await job.getState(),
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
      attemptsMade: job.attemptsMade,
    };
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.analyticsQueue.getWaitingCount(),
      this.analyticsQueue.getActiveCount(),
      this.analyticsQueue.getCompletedCount(),
      this.analyticsQueue.getFailedCount(),
      this.analyticsQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Enable/disable scheduler
   */
  setSchedulerEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    this.logger.log(`Analytics scheduler ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if scheduler is enabled
   */
  isSchedulerEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Clear all jobs from queue
   */
  async clearQueue() {
    await this.analyticsQueue.empty();
    this.logger.log('Analytics queue cleared');
  }

  /**
   * Pause queue processing
   */
  async pauseQueue() {
    await this.analyticsQueue.pause();
    this.logger.log('Analytics queue paused');
  }

  /**
   * Resume queue processing
   */
  async resumeQueue() {
    await this.analyticsQueue.resume();
    this.logger.log('Analytics queue resumed');
  }

  /**
   * Get recent jobs
   */
  async getRecentJobs(limit = 10) {
    const jobs = await this.analyticsQueue.getJobs(
      ['completed', 'failed', 'active', 'waiting'],
      0,
      limit - 1,
    );

    return Promise.all(
      jobs.map(async (job) => ({
        id: job.id,
        data: job.data,
        state: await job.getState(),
        progress: await job.progress(),
        finishedOn: job.finishedOn,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
      })),
    );
  }
}
