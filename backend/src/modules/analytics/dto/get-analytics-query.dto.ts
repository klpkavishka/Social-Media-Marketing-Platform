import { IsDateString, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAnalyticsQueryDto {
  @ApiProperty({
    description: 'Start date for analytics data',
    example: '2026-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date for analytics data',
    example: '2026-02-15',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Filter by platform',
    required: false,
    example: 'instagram',
  })
  @IsOptional()
  platform?: string;

  @ApiProperty({
    description: 'Filter by specific account IDs',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  accountIds?: string[];
}
