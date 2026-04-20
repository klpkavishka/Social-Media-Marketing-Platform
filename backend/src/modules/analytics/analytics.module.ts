import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsStorageService,
  AnalyticsAggregationService,
  AnalyticsSchedulerService,
} from './services';
import { Analytics } from './entities/analytics.entity';
import { SocialModule } from '../social/social.module';
import { SocialAccount } from '../social/entities/social-account.entity';
import { AnalyticsProcessor } from './processors/analytics.processor';
import {
  AnalyticsSnapshot,
  AnalyticsSnapshotSchema,
  PostMetric,
  PostMetricSchema,
  AudienceSnapshot,
  AudienceSnapshotSchema,
  FollowerGrowth,
  FollowerGrowthSchema,
} from './schemas';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytics, SocialAccount]),
    MongooseModule.forFeature([
      { name: AnalyticsSnapshot.name, schema: AnalyticsSnapshotSchema },
      { name: PostMetric.name, schema: PostMetricSchema },
      { name: AudienceSnapshot.name, schema: AudienceSnapshotSchema },
      { name: FollowerGrowth.name, schema: FollowerGrowthSchema },
    ]),
    BullModule.registerQueue({
      name: 'analytics',
    }),
    ScheduleModule.forRoot(),
    SocialModule,
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    AnalyticsStorageService,
    AnalyticsAggregationService,
    AnalyticsSchedulerService,
    AnalyticsProcessor,
  ],
  exports: [
    AnalyticsService,
    AnalyticsStorageService,
    AnalyticsAggregationService,
    AnalyticsSchedulerService,
  ],
})
export class AnalyticsModule {}
