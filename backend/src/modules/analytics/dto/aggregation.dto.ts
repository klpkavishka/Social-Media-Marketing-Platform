import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerAggregationDto {
  @ApiProperty({
    description: 'Start date for analytics collection (ISO 8601)',
    example: '2026-02-14T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for analytics collection (ISO 8601)',
    example: '2026-02-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class AggregationStatusDto {
  @ApiProperty({ description: 'Job ID' })
  id: string;

  @ApiProperty({ description: 'Job data' })
  data: any;

  @ApiProperty({ description: 'Job progress (0-100)' })
  progress: number;

  @ApiProperty({ description: 'Job state', example: 'completed' })
  state: string;

  @ApiProperty({ description: 'Failed reason if applicable', required: false })
  failedReason?: string;

  @ApiProperty({ description: 'Finished timestamp', required: false })
  finishedOn?: number;

  @ApiProperty({ description: 'Processed timestamp', required: false })
  processedOn?: number;

  @ApiProperty({ description: 'Number of attempts made' })
  attemptsMade: number;
}

export class QueueStatsDto {
  @ApiProperty({ description: 'Number of jobs waiting' })
  waiting: number;

  @ApiProperty({ description: 'Number of jobs active' })
  active: number;

  @ApiProperty({ description: 'Number of jobs completed' })
  completed: number;

  @ApiProperty({ description: 'Number of jobs failed' })
  failed: number;

  @ApiProperty({ description: 'Number of jobs delayed' })
  delayed: number;

  @ApiProperty({ description: 'Total number of jobs' })
  total: number;
}

export class AggregationSummaryDto {
  @ApiProperty({ description: 'Total accounts processed' })
  totalAccounts: number;

  @ApiProperty({ description: 'Successful accounts' })
  successfulAccounts: number;

  @ApiProperty({ description: 'Failed accounts' })
  failedAccounts: number;

  @ApiProperty({ description: 'Total metrics collected' })
  totalMetricsCollected: number;

  @ApiProperty({ description: 'Start time' })
  startTime: Date;

  @ApiProperty({ description: 'End time' })
  endTime: Date;

  @ApiProperty({ description: 'Duration in milliseconds' })
  duration: number;

  @ApiProperty({ description: 'Results per account' })
  results: Array<{
    accountId: string;
    platform: string;
    success: boolean;
    error?: string;
    metricsCollected?: number;
  }>;
}

export class SchedulerConfigDto {
  @ApiProperty({ description: 'Enable or disable scheduler' })
  enabled: boolean;
}
