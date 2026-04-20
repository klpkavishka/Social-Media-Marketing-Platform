import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsSchedulerService } from './services/analytics-scheduler.service';
import { AnalyticsAggregationService } from './services/analytics-aggregation.service';
import {
  GetAnalyticsQueryDto,
  GetPostAnalyticsDto,
  PlatformAnalyticsDto,
  PostAnalyticsDto,
  AudienceInsightsDto,
  AnalyticsAggregateDto,
  FollowerGrowthDto,
  TriggerAggregationDto,
  AggregationStatusDto,
  QueueStatsDto,
  AggregationSummaryDto,
  SchedulerConfigDto,
} from './dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly schedulerService: AnalyticsSchedulerService,
    private readonly aggregationService: AnalyticsAggregationService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview for all platforms' })
  @ApiResponse({
    status: 200,
    description: 'Returns aggregated analytics',
    type: AnalyticsAggregateDto,
  })
  async getOverview(@Query() query: GetAnalyticsQueryDto) {
    return this.analyticsService.getOverview(query);
  }

  @Get('platform/:accountId')
  @ApiOperation({ summary: 'Get analytics for a specific social account' })
  @ApiResponse({
    status: 200,
    description: 'Returns platform-specific analytics',
    type: PlatformAnalyticsDto,
  })
  async getPlatformAnalytics(
    @Param('accountId') accountId: string,
    @Query() query: GetAnalyticsQueryDto,
  ) {
    return this.analyticsService.getPlatformAnalytics(accountId, query);
  }

  @Post('posts')
  @ApiOperation({ summary: 'Get analytics for specific posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns post analytics',
    type: [PostAnalyticsDto],
  })
  async getPostAnalytics(@Body() dto: GetPostAnalyticsDto) {
    return this.analyticsService.getPostAnalytics(dto);
  }

  @Get('audience/:accountId')
  @ApiOperation({ summary: 'Get audience insights for an account' })
  @ApiResponse({
    status: 200,
    description: 'Returns audience demographics and insights',
    type: AudienceInsightsDto,
  })
  async getAudienceInsights(@Param('accountId') accountId: string) {
    return this.analyticsService.getAudienceInsights(accountId);
  }

  @Get('followers/:accountId')
  @ApiOperation({ summary: 'Get follower count for an account' })
  @ApiResponse({
    status: 200,
    description: 'Returns current follower count',
  })
  async getFollowerCount(@Param('accountId') accountId: string) {
    return this.analyticsService.getFollowerCount(accountId);
  }

  @Get('followers/:accountId/growth')
  @ApiOperation({ summary: 'Get follower growth over time' })
  @ApiResponse({
    status: 200,
    description: 'Returns historical follower data',
    type: [FollowerGrowthDto],
  })
  async getFollowerGrowth(
    @Param('accountId') accountId: string,
    @Query() query: GetAnalyticsQueryDto,
  ) {
    return this.analyticsService.getFollowerGrowth(accountId, query);
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Get engagement metrics' })
  async getEngagement(@Query() query: GetAnalyticsQueryDto) {
    return this.analyticsService.getEngagement(query);
  }

  @Get('content-performance')
  @ApiOperation({ summary: 'Get content performance comparison' })
  async getContentPerformance(@Query() query: GetAnalyticsQueryDto) {
    return this.analyticsService.getContentPerformance(query);
  }

  @Get('campaigns/:campaignId')
  @ApiOperation({ summary: 'Get campaign-specific analytics' })
  async getCampaignAnalytics(@Param('campaignId') campaignId: string) {
    return this.analyticsService.getCampaignAnalytics(campaignId);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending hashtags and topics' })
  async getTrending(@Query('platform') platform?: string) {
    return this.analyticsService.getTrending(platform);
  }

  @Post('refresh/:accountId')
  @ApiOperation({ summary: 'Manually refresh analytics for an account' })
  async refreshAnalytics(
    @Param('accountId') accountId: string,
    @Query() query: GetAnalyticsQueryDto,
  ) {
    return this.analyticsService.refreshAnalytics(accountId, query);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare analytics across multiple accounts' })
  async compareAccounts(@Query() query: GetAnalyticsQueryDto) {
    return this.analyticsService.compareAccounts(query);
  }

  // ============= Aggregation & Scheduling Endpoints =============

  @Post('aggregate/trigger')
  @ApiOperation({ summary: 'Manually trigger analytics aggregation for all accounts' })
  @ApiResponse({
    status: 200,
    description: 'Returns job ID for tracking',
    schema: {
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async triggerAggregation(@Body() dto: TriggerAggregationDto) {
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    const jobId = await this.schedulerService.triggerManualCollection(
      startDate,
      endDate,
    );

    return {
      jobId,
      message: 'Analytics aggregation job scheduled successfully',
    };
  }

  @Post('aggregate/account/:accountId')
  @ApiOperation({ summary: 'Trigger analytics aggregation for a specific account' })
  @ApiResponse({
    status: 200,
    description: 'Returns job ID for tracking',
  })
  async triggerAccountAggregation(
    @Param('accountId') accountId: string,
    @Body() dto: TriggerAggregationDto,
  ) {
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    const jobId = await this.schedulerService.triggerAccountCollection(
      accountId,
      startDate,
      endDate,
    );

    return {
      jobId,
      message: `Analytics aggregation job scheduled for account ${accountId}`,
    };
  }

  @Post('aggregate/platform/:platform')
  @ApiOperation({ summary: 'Trigger analytics aggregation for a platform' })
  @ApiResponse({
    status: 200,
    description: 'Returns job ID for tracking',
  })
  async triggerPlatformAggregation(
    @Param('platform') platform: string,
    @Body() dto: TriggerAggregationDto,
  ) {
    const startDate = dto.startDate ? new Date(dto.startDate) : undefined;
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    const jobId = await this.schedulerService.triggerPlatformCollection(
      platform,
      startDate,
      endDate,
    );

    return {
      jobId,
      message: `Analytics aggregation job scheduled for platform ${platform}`,
    };
  }

  @Get('aggregate/job/:jobId')
  @ApiOperation({ summary: 'Get status of an aggregation job' })
  @ApiResponse({
    status: 200,
    description: 'Returns job status and details',
    type: AggregationStatusDto,
  })
  async getJobStatus(@Param('jobId') jobId: string) {
    const status = await this.schedulerService.getJobStatus(jobId);

    if (!status) {
      return {
        message: 'Job not found',
      };
    }

    return status;
  }

  @Get('aggregate/queue/stats')
  @ApiOperation({ summary: 'Get analytics queue statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns queue statistics',
    type: QueueStatsDto,
  })
  async getQueueStats() {
    return this.schedulerService.getQueueStats();
  }

  @Get('aggregate/queue/jobs')
  @ApiOperation({ summary: 'Get recent aggregation jobs' })
  @ApiResponse({
    status: 200,
    description: 'Returns recent jobs',
  })
  async getRecentJobs(@Query('limit') limit?: number) {
    return this.schedulerService.getRecentJobs(limit || 10);
  }

  @Get('aggregate/stats')
  @ApiOperation({ summary: 'Get aggregation statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns aggregation stats',
  })
  async getAggregationStats(@Query() query: GetAnalyticsQueryDto) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    return this.aggregationService.getAggregationStats(startDate, endDate);
  }

  @Put('scheduler/config')
  @ApiOperation({ summary: 'Enable or disable scheduled aggregation' })
  @ApiResponse({
    status: 200,
    description: 'Scheduler configuration updated',
  })
  async updateSchedulerConfig(@Body() dto: SchedulerConfigDto) {
    this.schedulerService.setSchedulerEnabled(dto.enabled);

    return {
      enabled: dto.enabled,
      message: `Analytics scheduler ${dto.enabled ? 'enabled' : 'disabled'}`,
    };
  }

  @Get('scheduler/status')
  @ApiOperation({ summary: 'Get scheduler status' })
  @ApiResponse({
    status: 200,
    description: 'Returns scheduler status',
  })
  async getSchedulerStatus() {
    return {
      enabled: this.schedulerService.isSchedulerEnabled(),
    };
  }

  @Post('aggregate/queue/pause')
  @ApiOperation({ summary: 'Pause analytics queue processing' })
  async pauseQueue() {
    await this.schedulerService.pauseQueue();
    return { message: 'Queue paused successfully' };
  }

  @Post('aggregate/queue/resume')
  @ApiOperation({ summary: 'Resume analytics queue processing' })
  async resumeQueue() {
    await this.schedulerService.resumeQueue();
    return { message: 'Queue resumed successfully' };
  }

  @Post('aggregate/queue/clear')
  @ApiOperation({ summary: 'Clear all jobs from analytics queue' })
  async clearQueue() {
    await this.schedulerService.clearQueue();
    return { message: 'Queue cleared successfully' };
  }
}
