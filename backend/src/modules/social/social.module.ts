import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { SocialAccount } from './entities/social-account.entity';
import {
  InstagramService,
  FacebookService,
  TwitterService,
  LinkedInService,
  TikTokService,
} from './platforms';
import { PlatformAnalyticsService } from './platforms/platform-analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialAccount]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SocialController],
  providers: [
    SocialService,
    InstagramService,
    FacebookService,
    TwitterService,
    LinkedInService,
    TikTokService,
    PlatformAnalyticsService,
  ],
  exports: [
    SocialService,
    PlatformAnalyticsService,
    InstagramService,
    FacebookService,
    TwitterService,
    LinkedInService,
    TikTokService,
  ],
})
export class SocialModule {}
