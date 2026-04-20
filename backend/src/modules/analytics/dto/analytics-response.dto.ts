import { ApiProperty } from '@nestjs/swagger';

export class PlatformAnalyticsDto {
  @ApiProperty({ example: 12345 })
  impressions: number;

  @ApiProperty({ example: 9876 })
  reach: number;

  @ApiProperty({ example: 543 })
  engagement: number;

  @ApiProperty({ example: 432 })
  likes: number;

  @ApiProperty({ example: 98 })
  comments: number;

  @ApiProperty({ example: 13 })
  shares: number;

  @ApiProperty({ example: 56, required: false })
  saves?: number;

  @ApiProperty({ example: 234, required: false })
  clicks?: number;

  @ApiProperty({ example: 5432 })
  followers: number;

  @ApiProperty({ example: 125 })
  followerGrowth: number;

  @ApiProperty({ example: 3456, required: false })
  videoViews?: number;

  @ApiProperty({ example: 876, required: false })
  profileViews?: number;
}

export class PostAnalyticsDto {
  @ApiProperty({ example: 'post123' })
  postId: string;

  @ApiProperty({ example: 'instagram' })
  platform: string;

  @ApiProperty({ example: 1234 })
  impressions: number;

  @ApiProperty({ example: 987 })
  reach: number;

  @ApiProperty({ example: 54 })
  engagement: number;

  @ApiProperty({ example: 43 })
  likes: number;

  @ApiProperty({ example: 9 })
  comments: number;

  @ApiProperty({ example: 2 })
  shares: number;

  @ApiProperty({ example: 5, required: false })
  saves?: number;

  @ApiProperty({ example: 23, required: false })
  clicks?: number;

  @ApiProperty({ example: '2026-02-15T10:30:00Z' })
  timestamp: Date;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;
}

export class AudienceDemographicsDto {
  @ApiProperty({
    example: { '18-24': 35, '25-34': 40, '35-44': 15, '45+': 10 },
  })
  ageRange: Record<string, number>;

  @ApiProperty({ example: { male: 45, female: 52, other: 3 } })
  gender: Record<string, number>;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        country: { type: 'string', example: 'USA' },
        city: { type: 'string', example: 'New York' },
        percentage: { type: 'number', example: 45.5 },
      },
    },
  })
  location: Array<{ country: string; city?: string; percentage: number }>;
}

export class AudienceInsightsDto {
  @ApiProperty({ type: () => AudienceDemographicsDto })
  demographics: AudienceDemographicsDto;

  @ApiProperty({
    type: [String],
    required: false,
    example: ['technology', 'business', 'marketing'],
  })
  interests?: string[];

  @ApiProperty({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        hour: { type: 'number', example: 18 },
        dayOfWeek: { type: 'string', example: 'Monday' },
        count: { type: 'number', example: 1234 },
      },
    },
  })
  activeHours?: Array<{ hour: number; dayOfWeek: string; count: number }>;
}

export class AnalyticsAggregateDto {
  @ApiProperty({ type: () => PlatformAnalyticsDto })
  aggregated: PlatformAnalyticsDto;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      instagram: {
        impressions: 5432,
        reach: 4321,
        engagement: 234,
        likes: 198,
        comments: 45,
        shares: 12,
        followers: 2345,
        followerGrowth: 67,
      },
      facebook: {
        impressions: 3456,
        reach: 2987,
        engagement: 156,
        likes: 132,
        comments: 34,
        shares: 8,
        followers: 1876,
        followerGrowth: 45,
      },
    },
  })
  byPlatform: Record<string, PlatformAnalyticsDto>;
}

export class FollowerGrowthDto {
  @ApiProperty({ example: '2026-02-01' })
  date: Date;

  @ApiProperty({ example: 5432 })
  count: number;
}
