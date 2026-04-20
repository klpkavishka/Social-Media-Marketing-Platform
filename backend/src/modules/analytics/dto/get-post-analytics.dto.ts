import { IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPostAnalyticsDto {
  @ApiProperty({
    description: 'Social account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'Array of post IDs to fetch analytics for',
    type: [String],
    example: ['post123', 'post456'],
  })
  @IsArray()
  postIds: string[];
}
